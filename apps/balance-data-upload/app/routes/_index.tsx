import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useActionData, useFetcher } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { ArrowPathIcon, ArrowUpOnSquareIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { zipContainerClient, jsonContainerClient } from "~/services/blobService"
import { BlobClient, BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"
import { useMachine } from "@xstate/react"
import { uploadStatusMachine, expirationDurationMilliseconds, pollIntervalDelayMilliseconds } from "~/stateMachines/uploadStatusMachine"
import { delay } from "~/utilities"
import classNames from "classnames"

const millisecondsPerSecond = 1000
const processFormName = 'process'

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  )

  const actionUrl = new URL(request.url)
  console.log({ actionUrl: actionUrl.href })

  if (actionUrl.searchParams.has('upload')) {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    )

    const password = formData.get("password") as string
    if (password !== process.env.UPLOAD_PASSWORD) {
      console.error(`Invalid password.`, { password, expectedPassword: process.env.UPLOAD_PASSWORD })
      return {
        error: {
          message: 'Invalid password.'
        }
      }
    }

    const balanceDataFiles = formData.getAll("files") as File[]

    if (balanceDataFiles.length > 0) {
      const uploadResponses: Array<{
        blockBlobClient: BlockBlobClient,
        response: BlockBlobUploadResponse,
        uploadTime: number,
        modifiedUploadTime: number,
        expirationTime: number,
      }> = []

      for (const balanceDataFile of balanceDataFiles) {
        const uploadTime = Date.now()
        const filename = `balancedata_${Date.now()}.zip`
        const fileBuffer = await balanceDataFile.arrayBuffer()
        const uploadResponse = await zipContainerClient.uploadBlockBlob(filename, fileBuffer, fileBuffer.byteLength)

        // TODO: Why do we have to modify the upload time?
        // I suspect when we are setting the upload time, is actually later then when the blob is uploaded.
        // OR the clock between local client and the server are not synced. The difference is the time we offset.
        const modifiedUploadTime = uploadTime - (50 * millisecondsPerSecond)
        const expirationTime = uploadTime + expirationDurationMilliseconds

        console.log('Upload - Times: ', { uploadTime, modifiedUploadTime, expirationTime })
        uploadResponses.push({ ...uploadResponse, uploadTime, modifiedUploadTime, expirationTime })
      }

      const uploadedBlobData = uploadResponses.map(({ blockBlobClient, response, ...otherProperties }) => {
        return {
          url: blockBlobClient.url,
          name: blockBlobClient.name,
          ...otherProperties
        }
      })
      console.log('Action: ', { uploadedBlobData })

      return {
        uploadedBlobData,
      }
    }
  }

  const rawFormData = await request.formData()
  const formData = Object.fromEntries(rawFormData.entries())
  if (formData.intent === processFormName) {
    console.log('Begin polling for processed .json blob... ', formData)

    let processedBlobClient: BlobClient | undefined
    const maxPageSize = 50
    const uploadTime = formData.uploadTime as unknown as number
    const modifiedUploadTime = formData.modifiedUploadTime as unknown as number
    const expirationTime = formData.expirationTime as unknown as number

    while (!Boolean(processedBlobClient)) {
      console.log(`Get top ${maxPageSize} json blobs ${Date.now()}...`)
      const iterator = jsonContainerClient.listBlobsFlat().byPage({ maxPageSize })
      const response = (await iterator.next()).value

      for (const [blobIndex, blob] of response.segment.blobItems.reverse().entries()) {
        const blobLastModified = new Date(blob.properties.lastModified)
        const timeAfterUploadMilliseconds = blobLastModified.getTime() - modifiedUploadTime // uploadTime
        const timeAfterUploadSeconds = timeAfterUploadMilliseconds / millisecondsPerSecond
        console.log(`⏲️ ${blobIndex + 1}: Blob ${blob.name} was modified ${timeAfterUploadSeconds} seconds after upload time.`)
        const isBlobTheUploadedBlob = timeAfterUploadSeconds > 0
        if (isBlobTheUploadedBlob) {
          console.log(`✅ ${timeAfterUploadSeconds} is positive which means it is highly likely to the blob produced by processing the uploaded file.`)

          processedBlobClient = jsonContainerClient.getBlobClient(blob.name)
          break
        }
        else {
        }
      }

      const remainingMilliseconds = expirationTime - Date.now()
      const remainingSeconds = remainingMilliseconds / millisecondsPerSecond
      if (!Boolean(processedBlobClient)) {
        if (remainingSeconds < 0) {
          console.warn('⚠️ Expiration time reached. Stop polling.')
          return null
        }

        console.warn(`None of the blobs were modified after start time. Which means they must have existed before.`)
        console.warn(`${remainingSeconds} seconds remaining before expiration. Delay ${pollIntervalDelayMilliseconds / millisecondsPerSecond} seconds before next request...`)
        await delay(pollIntervalDelayMilliseconds)
      }
    }

    const processedBlobData = {
      url: processedBlobClient?.url,
      name: processedBlobClient?.name
    }
    console.log('Action: ', { processedBlobData })

    return {
      processedBlobData,
    }
  }
}

export default function Index() {
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>()
  const [uploadedBlobData, setUploadedBlobData] = useState<{ url: string, name: string }>()
  const [processedBlobData, setProcessedBlobData] = useState<{ url: string, name: string }>()
  const actionData = useActionData<typeof action>()
  const processFetcher = useFetcher()

  const [uploadMachineState, uploadMachineSend, uploadActor] = useMachine(
    uploadStatusMachine.provide({
      actions: {
        recordStartTime: ({
          context,
          event,
        }) => {
          console.log('Record Start Time', { event })
          context.startTime = Date.now()
        },
        resetForm: ({
          context,
          event,
        }) => {
          console.log('Reset', { event })
          context.formRef?.reset()
          delete context.startTime
          delete context.timerExpired
          delete context.endTime
          setFiles([])
        },
        requestBlobs: ({
          context,
          event,
        }) => {
          console.log('Request Blobs', { event })
        },
        timerExpired: ({
          context,
          event,
        }) => {
          console.log('Timer Expired', { event })
          context.timerExpired = true
        },
        recordEndTime: ({
          context,
          event,
        }) => {
          console.log('Record End Time', { event })
          context.endTime = Date.now()
        }
      },
    })
  )

  uploadActor.subscribe((state) => {
    const stateString = JSON.stringify(state.value).replace(/["]|[{]|[}]/g, '')
    console.log('Upload Actor State: ', { stateString, value: JSON.stringify(state.value), context: JSON.stringify(state.context) })
  })

  const onFolderPickerClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    console.log('onFolderPickerClick', { event })
  }

  const onFolderPickerChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log('onFolderPickerChange', { event })
    const files = [...event.target?.files ?? []]
    const fileExtensions = files
      .map(file => file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase())
    const fileExtensionsSet = new Set(fileExtensions)
    if (fileExtensionsSet.size >= 1) {
      const uniqueFileExtensions = [...fileExtensionsSet.values()]
      const containsNonZipFile = uniqueFileExtensions.some(ext => ext !== 'zip')
      if (containsNonZipFile) {
        alert(`Please only upload .zip files. Found extentions: ${uniqueFileExtensions.join(', ')}`)
        event.preventDefault()
        event.stopPropagation()
        folderPickerRef.current?.form?.reset()
        setFiles([])
        return
      }
    }

    setFiles(files)
  }

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    console.log('Form Submitted!', { now: Date.now() })
    uploadMachineSend({ type: 'upload' })
  }

  useEffect(() => {
    const isUploadError = typeof (actionData as any)?.error?.message === 'string'
    if (isUploadError) {
      console.log({ isUploadError }, "Reset Form")
      uploadMachineSend({ type: 'reset' })
    }

    const firstBlobData = (actionData as any)?.uploadedBlobData?.at(0)
    if (firstBlobData) {
      const { url, name, uploadTime, modifiedUploadTime, expirationTime } = firstBlobData
      const uploadedBlobData = { url, name }
      console.log('useEffect[actionData]: ', { uploadedBlobData })
      setUploadedBlobData(uploadedBlobData)

      console.log('uploadMachineSend: process')
      uploadMachineSend({ type: 'process' })

      console.log('processFetcher: submit')
      const processSubmitData = {
        intent: processFormName,
        uploadTime,
        modifiedUploadTime,
        expirationTime
      }

      processFetcher.submit(processSubmitData, {
        method: 'POST',
        action: '?index&process=true',
      })
    }
  }, [actionData])

  useEffect(() => {
    const processedBlobData = (processFetcher.data as any)?.processedBlobData
    if (processedBlobData) {
      console.log('useEffect[processFetcher]: ', { processedBlobData })
      setProcessedBlobData(processedBlobData)
      uploadMachineSend({ type: 'blobFound' })
      folderPickerRef.current?.form?.reset()
    }
  }, [processFetcher])

  const machineStateJsonString = JSON.stringify(uploadMachineState.value).replace(/["]|[{]|[}]/g, '')
  const isMachineActive = uploadMachineState.matches('Uploading') || uploadMachineState.matches('Processing')
  const hasUploaded = uploadMachineState.matches('Processing') || uploadMachineState.matches('ProcessComplete')
  const hasExpired = uploadMachineState.matches('ProcessFailed')
  const hasProcessed = uploadMachineState.matches('ProcessComplete')

  const isFormDisabled = isMachineActive || hasUploaded
  const selectedFilesLength = files?.length ?? 0
  const uploadButtonClassNames = classNames({
    [`flex flex-row gap-2 p-4 px-6 rounded-md ring-2 ring-offset-4 border-none font-semibold`]: true,
    ['text-slate-300 bg-blue-800 ring-blue-400 ring-offset-slate-900']: isFormDisabled,
    ['text-white bg-green-500 ring-green-200 ring-offset-green-900 shadow-[0_5px_80px_-15px_white] shadow-green-200']: !isFormDisabled && selectedFilesLength > 0,
    ['text-white bg-blue-500 ring-blue-200 ring-offset-slate-900']: !isFormDisabled && selectedFilesLength <= 0
  })

  const resetButtonClassNames = classNames({
    [`flex flex-row gap-2 p-3 px-4 rounded-md ring-2 ring-offset-4 border-none font-semibold`]: true,
    ['text-slate-300 bg-blue-800 ring-blue-400 ring-offset-slate-900']: isFormDisabled,
    ['text-white bg-red-500 ring-red-200 ring-offset-slate-900']: !isFormDisabled
  })

  return (
    <>
      <div className="flex flex-col gap-6 items-center p-10 text-2xl text-blue-100">
        <h1 className="text-6xl font-bold text-slate-50">SC2 Balance Data Upload</h1>
        <h2 className="text-4xl font-semibold">Instructions</h2>
        <div className="flex gap-10 mb-5">
          <div className="flex flex-col gap-3">
            <div><b>1.</b> Open SC2Editor</div>
            <img src="/images/step1_open_editor.png" alt="The icon for SC2 Editor" width="250" className="ring-2 ring-blue-400 ring-offset-slate-900 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>2.</b> Export Balance Data to Folder</div>
            <img src="/images/step2_export_balance_data.png" alt="The file menu of SC2 editor application. Export Balance Data > Legacy of the Void" width="450" className="ring-2 ring-blue-400 ring-offset-slate-900 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>3.</b> Compress folder to .zip file</div>
            <img src="/images/step3_compress_folder.png" alt="Right click menu on balance data folder with 'Compress as Zip file' highlighted" width="350" className="ring-2 ring-blue-400 ring-offset-slate-900 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>4.</b> Upload .zip file</div>
            <img src="/images/step4_upload_zip_file.png" alt="File explorer with .zip file highlighted" width="250" className="ring-2 ring-blue-400 ring-offset-slate-900 ring-offset-4 rounded-2xl" />
          </div>
        </div>
        <Form
          method="post"
          action="?index&upload=true"
          encType="multipart/form-data"
          onSubmit={onFormSubmit}
        >
          <fieldset
            className="flex flex-col gap-8 items-center px-6"
            disabled={isFormDisabled}
          >
            <label htmlFor="password" className="text-3xl font-semibold">Password:</label>
            <input
              type="password"
              className={`p-4 rounded-md bg-slate-300 ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none text-slate-800 font-semibold ${isFormDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              name="password"
              id="password"
              placeholder="Enter password..."
              required
            />
            {typeof (actionData as any)?.error?.message === 'string' && (<div className="text-red-600 font-semibold">Error: {(actionData as any).error.message}</div>)}
            <label htmlFor="filepicker" className="text-3xl font-semibold">Upload Balance Data .zip File:</label>
            <input
              ref={folderPickerRef}
              type="file"
              id="filepicker"
              name="files"
              placeholder="Choose"
              onClick={onFolderPickerClick}
              onChange={onFolderPickerChange}
              required
              accept=".zip"
              className={`p-4 rounded-md bg-slate-300 ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none text-slate-800 font-semibold ${isFormDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            />

            <div>
              <button type="submit" className={uploadButtonClassNames}>
                <ArrowUpOnSquareIcon className="h-8 w-8" />
                Upload
              </button>
            </div>
            <div>
              <button type="reset" className={resetButtonClassNames}>
                <XCircleIcon className="h-8 w-8 text-red-100" />
                Reset
              </button>
            </div>
          </fieldset>
        </Form>
        <div className="w-1/2 flex gap-4">
          <div>Status:</div>
          <div className="text-blue-100 font-medium">
            <div className="flex gap-2">
              <span>{machineStateJsonString}{isMachineActive ? '...' : null}</span>
              {isMachineActive
                ? <ArrowPathIcon className="animate-spin h-8 w-8 text-slate-100 " />
                : null}
            </div>
          </div>
        </div>
        <div className="w-3/4 p-4 rounded-md ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none font-semibold">
          <div className="grid grid-cols-[50px_1fr_3fr_50px] gap-4 text-slate-500">
            <div className={`${hasUploaded ? 'text-slate-200' : ''}`}>1</div>
            <span className={`${hasUploaded ? 'text-slate-200' : ''}`}>Uploaded</span>
            <div>{uploadedBlobData ? <a target="_blank" referrerPolicy="no-referrer" href={uploadedBlobData.url} className="text-blue-300 underline font-medium">{uploadedBlobData.name}</a> : '-'}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasUploaded ? 'text-green-500' : ''}`} />

            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2.1</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed (XML)</span>
            <div>{processedBlobData ? <a target="_blank" referrerPolicy="no-referrer" href={processedBlobData.url.replace('sc2-balancedata-json', 'sc2-balancedata-xml').replace('json', 'xml')} className="text-blue-300 underline font-medium">{processedBlobData.name.replace('json', 'xml')}</a> : '-'}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : hasExpired ? 'text-red-400' : ''}`} />

            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2.2</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed (JSON)</span>
            <div>{processedBlobData ? <a target="_blank" referrerPolicy="no-referrer" href={processedBlobData.url} className="text-blue-300 underline font-medium">{processedBlobData.name}</a> : '-'}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : hasExpired ? 'text-red-400' : ''}`} />

            <div className={`${uploadMachineState.done ? 'text-slate-200' : ''}`}>3</div>
            <span className={`${uploadMachineState.done ? 'text-slate-200' : ''}`}>Finished</span>
            <div className={`${uploadMachineState.done ? 'text-blue-300' : ''} font-medium`}>{uploadMachineState.done ? hasExpired ? `${expirationDurationMilliseconds / 1000} Second Timer Expired!` : `Blob Processed Succesfully!` : '-'}</div>
            <CheckCircleIcon className={`h-8 w-8 ${uploadMachineState.done ? hasProcessed ? 'text-green-500' : hasExpired ? 'text-red-400' : '' : ''}`} />
          </div>
        </div>
      </div>
    </>
  )
}
