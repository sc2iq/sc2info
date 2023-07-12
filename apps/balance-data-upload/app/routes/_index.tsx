import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { ArrowPathIcon, ArrowUpOnSquareIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { zipContainerClient, jsonContainerClient } from "~/services/blobService"
import { BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"
import { useMachine } from "@xstate/react"
import { uploadStatusMachine } from "~/stateMachines/uploadStatusMachine"
import { sendTo } from "xstate"
import { delay } from "~/utilities"

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  )

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  )

  const balanceDataFiles = formData.getAll("files") as File[]
  let processedBlobClient = null

  if (balanceDataFiles.length > 0) {
    const uploadResponses: Array<{ blockBlobClient: BlockBlobClient, response: BlockBlobUploadResponse }> = []

    for (const balanceDataFile of balanceDataFiles) {

      const filename = `balancedata_${Date.now()}.zip`
      const fileBuffer = await balanceDataFile.arrayBuffer()
      const uploadResponse = await zipContainerClient.uploadBlockBlob(filename, fileBuffer, fileBuffer.byteLength)

      const millisecondsPerSecond = 1000
      const uploadTime = Date.now()
      // TODO: Why do we have to modify the upload time by 40 seconds?
      // I suspect the clock between local client and the server are not synced. The difference is the time we offset.
      const modifiedUploadTime = uploadTime - (40 * millisecondsPerSecond)
      const expirationTime = uploadTime + (40 * millisecondsPerSecond)
      const maxPageSize = 8

      console.log('Upload Time: ', { uploadTime })
      console.log('Expiration Time: ', { expirationTIme: expirationTime })
      console.log('Begin polling for json blob...')

      while (!Boolean(processedBlobClient)) {
        console.log(`Get top ${maxPageSize} json blobs ${Date.now()}...`)
        const iterator = jsonContainerClient.listBlobsFlat().byPage({ maxPageSize })
        const response = (await iterator.next()).value

        for (const [blobIndex, blob] of response.segment.blobItems.entries()) {
          // Get blob modified date
          const blobLastModified = new Date(blob.properties.lastModified)
          console.log(`⏲️ ${blobIndex + 1}: Last Modified Time: ${blobLastModified.getTime()}`)
          console.log(`⏲️ ${blobIndex + 1}: Upload Time: ${uploadTime}`)
          console.log(`⏲️ ${blobIndex + 1}: Upload Time (Modified): ${modifiedUploadTime}`)
          const timeAgoMilliseconds = blobLastModified.getTime() - modifiedUploadTime // uploadTime
          const timeAgoSeconds = timeAgoMilliseconds / millisecondsPerSecond
          console.log(`⏲️ ${blobIndex + 1}: Blob ${blob.name} was modified ${timeAgoSeconds} seconds ago.`)
          if (timeAgoSeconds > 0) {
            console.log(`✅ ${blobIndex + 1}: Blob ${blob.name} was modified after upload time.`)
            console.log(`This means it is highly likely to the blob produced by processing the uploaded file.`)

            processedBlobClient = jsonContainerClient.getBlobClient(blob.name)
            break
          }
        }

        const remainingMilliseconds = expirationTime - Date.now()
        const remainingSeconds = remainingMilliseconds / millisecondsPerSecond

        if (!Boolean(processedBlobClient)) {
          const secondsDelay = 5
          console.log(`None of the blobs were modified after start time. Which means they must have existed before.`)
          console.log(`${remainingSeconds} remaining before expiration. Delay ${secondsDelay} seconds before next request...`)
          await delay(secondsDelay * millisecondsPerSecond)
        }

        if (remainingSeconds < 0) {
          console.warn('⚠️ Expiration time reached. Stop polling.')
          break
        }
      }

      uploadResponses.push(uploadResponse)
    }

    const uploadedBlobUrls = uploadResponses.map(({ blockBlobClient }) => blockBlobClient.url)
    const processedBlobUrl = processedBlobClient?.url
    console.log('Action: ', { uploadedBlobUrls, processedBlobUrl })

    return {
      uploadedBlobUrls,
      processedBlobUrl,
    }
  }

  return null
}

export default function Index() {
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>()
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>()
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string>()
  const actionData = useActionData<typeof action>()
  const [uploadMachineState, uploadMachineSend, uploadActor] = useMachine(
    uploadStatusMachine.provide({
      actions: {
        recordCurrentTime: ({
          context,
          event,
        }) => {
          console.log('Record Current Time Edited!')
          context.startTime = Date.now()
        },
        resetForm: ({
          context,
          event,
        }) => {
          console.log('Reset Form Edited!')
          context.formRef?.reset()
          setFiles([])
        },
        requestBlobs: ({
          context,
          event,
        }) => {
          console.log('Request Blobs Edited!')
          console.log('context', context)
          sendTo(context.uploadActor, { type: 'blobFound' })
        },
      },
    })
  )

  uploadActor.subscribe(state => {
    console.log('Upload Actor State: ', JSON.stringify(state.value).replace(/["]|[{]|[}]/g, ''), { value: state.value })
  })

  const folderPickerChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
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
      }
    }

    setFiles(files)
  }

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    uploadMachineSend({ type: 'upload' })
  }

  // After form is submitted, reset the form
  useEffect(() => {
    const firstBlobUrl = actionData?.uploadedBlobUrls?.at(0)
    if (firstBlobUrl) {
      setUploadedBlobUrl(firstBlobUrl)
      folderPickerRef.current?.form?.reset()
      uploadMachineSend({ type: 'process' })
    }

    if (actionData?.processedBlobUrl) {
      setProcessedBlobUrl(actionData?.processedBlobUrl)
      uploadMachineSend({ type: 'blobFound' })
    }
  }, [actionData])

  const doesStateStringIncludeStates = (states: string[], stateString: string) => {
    return states.some(s => stateString.includes(s))
  }
  const machineStateJsonString = JSON.stringify(uploadMachineState.value).replace(/["]|[{]|[}]/g, '')
  const hasUploaded = doesStateStringIncludeStates(['Processing', 'Complete'], machineStateJsonString)
  // const hasUploaded = uploadMachineState.matches('Processing')
  const hasExpired = uploadMachineState.matches('TimerExpired')
  const hasProcessed = uploadMachineState.matches('Complete')

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
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-8 items-center" onSubmit={onFormSubmit}>
          <label htmlFor="filepicker" className="text-3xl font-semibold">Upload Balance Data .zip File:</label>
          <input
            ref={folderPickerRef}
            type="file"
            id="filepicker"
            name="files"
            placeholder="Choose"
            onChange={folderPickerChange}
            required
            accept=".zip"
            className="p-4 rounded-md bg-slate-300 ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none text-slate-800 font-semibold cursor-pointer"
          />
          <div>
            <button type="submit" className={`flex flex-row gap-2 p-4 px-6 rounded-md ring-2 ${(files?.length ?? 0) > 0 ? 'bg-green-500 ring-green-200 ring-offset-green-900 shadow-[0_5px_80px_-15px_white] shadow-green-200' : 'bg-blue-500 ring-blue-200 ring-offset-slate-900'} ring-offset-4 border-none text-white font-semibold`}>
              <ArrowUpOnSquareIcon className="h-8 w-8 text-slate-100" />
              Upload
            </button>
          </div>
        </Form>
        <div className="w-1/2 flex gap-4">
          <div>Status:</div>
          <div className="text-blue-100 font-medium">
            <div className="flex gap-2">
              <span>{machineStateJsonString}...</span>
              {!doesStateStringIncludeStates(['Inactive', 'Complete'], machineStateJsonString)
                ? <ArrowPathIcon className="animate-spin h-8 w-8 text-slate-100 " />
                : null}
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4 rounded-md ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none font-semibold">
          <div className="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-slate-500">
            <div className={`${hasUploaded ? 'text-slate-200' : ''}`}>1</div>
            <span className={`${hasUploaded ? 'text-slate-200' : ''}`}>Uploaded</span>
            <div className={`${hasProcessed ? 'text-slate-400' : ''}`}>{uploadedBlobUrl ? <a href={uploadedBlobUrl} className="text-blue-300 underline font-medium">{uploadedBlobUrl}</a> : null}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasUploaded ? 'text-green-500' : ''}`} />
            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed</span>
            <div className={`${hasProcessed ? 'text-slate-400' : ''}`}>{processedBlobUrl ? <a href={processedBlobUrl} className="text-blue-300 underline font-medium">{processedBlobUrl}</a> : null}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : hasExpired ? 'text-red-400' : ''}`} />
            <div className={`${uploadMachineState.done ? 'text-slate-200' : ''}`}>3</div>
            <span className={`${uploadMachineState.done ? 'text-slate-200' : ''}`}>Complete</span>
            <div></div>
            <CheckCircleIcon className={`h-8 w-8 ${uploadMachineState.done ? 'text-green-500' : hasExpired ? 'text-red-400' : ''}`} />
          </div>
        </div>
      </div>
    </>
  )
}
