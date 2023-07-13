import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import { ArrowPathIcon, ArrowUpOnSquareIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { zipContainerClient, jsonContainerClient } from "~/services/blobService"
import { BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"
import { useMachine } from "@xstate/react"
import { uploadStatusMachine } from "~/stateMachines/uploadStatusMachine"
import { delay } from "~/utilities"

const uploadHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    maxPartSize: 5_000_000,
    file: ({ filename }) => filename,
  }),
  // parse everything else into memory
  unstable_createMemoryUploadHandler()
)

export const action = async ({ request }: ActionArgs) => {
  const actionUrl = new URL(request.url)
  console.log({ actionUrl: actionUrl.href })

  if (actionUrl.searchParams.has('upload')) {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    )

    const balanceDataFiles = formData.getAll("files") as File[]
    let processedBlobClient = null

    if (balanceDataFiles.length > 0) {
      const uploadResponses: Array<{ blockBlobClient: BlockBlobClient, response: BlockBlobUploadResponse }> = []

      for (const balanceDataFile of balanceDataFiles) {
        const millisecondsPerSecond = 1000
        const uploadTime = Date.now()
        const filename = `balancedata_${Date.now()}.zip`
        const fileBuffer = await balanceDataFile.arrayBuffer()
        const uploadResponse = await zipContainerClient.uploadBlockBlob(filename, fileBuffer, fileBuffer.byteLength)

        // TODO: Why do we have to modify the upload time?
        // I suspect when we are setting the upload time, is actually later then when the blob is uploaded.
        // OR the clock between local client and the server are not synced. The difference is the time we offset.
        const modifiedUploadTime = uploadTime - (50 * millisecondsPerSecond)
        const expirationTime = uploadTime + (5 * millisecondsPerSecond)
        const maxPageSize = 40

        console.log('Upload Time: ', { uploadTime })
        console.log('Begin polling for json blob...')

        while (!Boolean(processedBlobClient)) {
          console.log(`Get top ${maxPageSize} json blobs ${Date.now()}...`)
          const iterator = jsonContainerClient.listBlobsFlat().byPage({ maxPageSize })
          const response = (await iterator.next()).value

          for (const [blobIndex, blob] of response.segment.blobItems.reverse().entries()) {
            // Get blob modified date
            const blobLastModified = new Date(blob.properties.lastModified)
            // console.debug(`⏲️ ${blobIndex + 1}: Last Modified Time: ${blobLastModified.getTime()}`)
            // console.debug(`⏲️ ${blobIndex + 1}: Upload Time: ${uploadTime}`)
            // console.debug(`⏲️ ${blobIndex + 1}: Upload Time (Modified): ${modifiedUploadTime}`)
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
            console.warn(`None of the blobs were modified after start time. Which means they must have existed before.`)
            console.warn(`${remainingSeconds} remaining before expiration. Delay ${secondsDelay} seconds before next request...`)
            await delay(secondsDelay * millisecondsPerSecond)
          }

          if (remainingSeconds < 0) {
            console.warn('⚠️ Expiration time reached. Stop polling.')
            break
          }
        }

        uploadResponses.push(uploadResponse)
      }

      const uploadedBlobData = uploadResponses.map(({ blockBlobClient }) => ({ url: blockBlobClient.url, name: blockBlobClient.name }))
      const processedBlobData = { url: processedBlobClient?.url, name: processedBlobClient?.name }
      console.log('Action: ', { uploadedBlobData, processedBlobData })

      return {
        uploadedBlobData,
        processedBlobData,
      }
    }
  }

  const rawFormData = await request.formData()
  const formData = Object.fromEntries(rawFormData.entries())
  if (formData.intent === 'process') {
    console.log('Process Form Data: ', formData)
    return {}
  }

  return null
}

export default function Index() {
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>()
  const [uploadedBlobData, setUploadedBlobData] = useState<{ url: string, name: string }>()
  const [processedBlobData, setProcessedBlobData] = useState<{ url: string, name: string }>()
  const actionData = useActionData<typeof action>()
  const [uploadMachineState, uploadMachineSend, uploadActor] = useMachine(
    uploadStatusMachine.provide({
      actions: {
        recordStartTime: ({
          context,
          event,
        }) => {
          console.log('Record Start Time')
          context.startTime = Date.now()
        },
        resetForm: ({
          context,
          event,
        }) => {
          console.log('Reset Form')
          context.formRef?.reset()
          setFiles([])
        },
        requestBlobs: ({
          context,
          event,
        }) => {
          console.log('Request Blobs')
        },
        timerExpired: ({
          context,
          event,
        }) => {
          console.log('Timer Expired')
          context.timerExpired = true
        },
        recordEndTime: ({
          context,
          event,
        }) => {
          console.log('Record End Time')
          context.endTime = Date.now()
        }
      },
    })
  )

  uploadActor.subscribe((state) => {
    const stateString = JSON.stringify(state.value).replace(/["]|[{]|[}]/g, '')
    console.log('Upload Actor State: ', stateString, { value: state.value, context: state.context })
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
    console.log('Form Submitted!', { now: Date.now() })
    uploadMachineSend({ type: 'upload' })
  }

  // After form is submitted, reset the form
  useEffect(() => {
    const firstBlobData = (actionData as any)?.uploadedBlobData?.at(0)
    if (firstBlobData) {
      setUploadedBlobData(firstBlobData)
      folderPickerRef.current?.form?.reset()
      console.log('send process')
      uploadMachineSend({ type: 'process' })
    }

    const processedBlobData = (actionData as any)?.processedBlobData
    if (processedBlobData) {
      setProcessedBlobData(processedBlobData)
      uploadMachineSend({ type: 'blobFound' })
    }
  }, [actionData])

  const doesStateStringIncludeStates = (states: string[], stateString: string) => {
    return states.some(s => stateString.includes(s))
  }
  const machineStateJsonString = JSON.stringify(uploadMachineState.value).replace(/["]|[{]|[}]/g, '')
  const hasUploaded = doesStateStringIncludeStates(['Processing', 'ProcessComplete'], machineStateJsonString)
  const hasExpired = false
  // const hasUploaded = uploadMachineState.matches('Processing')
  const hasProcessed = uploadMachineState.matches('ProcessComplete')

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
          className="flex flex-col gap-8 items-center"
          onSubmit={onFormSubmit}
        >
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
        <div className="w-3/4 p-4 rounded-md ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none font-semibold">
          <div className="grid grid-cols-[50px_1fr_3fr_50px] gap-4 text-slate-500">
            <div className={`${hasUploaded ? 'text-slate-200' : ''}`}>1</div>
            <span className={`${hasUploaded ? 'text-slate-200' : ''}`}>Uploaded</span>
            <div>{uploadedBlobData ? <a href={uploadedBlobData.url} className="text-blue-300 underline font-medium">{uploadedBlobData.name}</a> : null}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasUploaded ? 'text-green-500' : ''}`} />

            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed (XML)</span>
            <div>{processedBlobData ? <a href={processedBlobData.url.replace('sc2-balancedata-json', 'sc2-balancedata-xml').replace('json','xml')} className="text-blue-300 underline font-medium">{processedBlobData.name.replace('json','xml')}</a> : null}</div>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : hasExpired ? 'text-red-400' : ''}`} />

            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed (JSON)</span>
            <div>{processedBlobData ? <a href={processedBlobData.url} className="text-blue-300 underline font-medium">{processedBlobData.name}</a> : null}</div>
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
