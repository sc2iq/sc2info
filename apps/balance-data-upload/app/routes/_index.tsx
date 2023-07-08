import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import '../types.d.ts'
import { useEffect, useRef, useState } from "react"
import { ArrowPathIcon, ArrowUpOnSquareIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { containerClient } from "~/services/blobService"
import { BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"
import { useMachine } from "@xstate/react"
import { uploadStatusMachine } from "~/stateMachines/uploadStatusMachine"

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
  if (balanceDataFiles.length > 0) {
    const uploadResponses: Array<{ blockBlobClient: BlockBlobClient, response: BlockBlobUploadResponse }> = []

    for (const balanceDataFile of balanceDataFiles) {
      console.log({ balanceDataFile })
      const filename = `balancedata_${Date.now()}.zip`
      const fileBuffer = await balanceDataFile.arrayBuffer()
      const uploadResponse = await containerClient.uploadBlockBlob(filename, fileBuffer, fileBuffer.byteLength)
      uploadResponses.push(uploadResponse)
    }

    console.log('Action: ', { uploadResponses })
    return {
      uploadResponses,
    }
  }

  return null
}

export default function Index() {
  const navigation = useNavigation()
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>()
  const actionData = useActionData<typeof action>()
  const [uploadMachineState, uploadMachineSend, uploadActor] = useMachine(uploadStatusMachine)
  // Subscribe to the machine state
  useEffect(() => {
    console.log('Upload Machine State: ', { value: uploadMachineState.value })
  }, [uploadMachineState])

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
        uploadMachineSend({ type: 'RESET' })
      }
    }
  }

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    uploadMachineSend({ type: 'UPLOAD' })
  }

  // After form is submitted, reset the form
  useEffect(() => {
    const blobBlobClient = actionData?.uploadResponses?.at(0)?.blockBlobClient
    if (blobBlobClient) {
      setUploadedBlobUrl(blobBlobClient.url)
      folderPickerRef.current?.form?.reset()
      uploadMachineSend({ type: 'PROCESS' })
    }
  }, [actionData])

  const hasUploaded = ['Processing', 'Complete'].includes(uploadMachineState.value.toString())
  const hasProcessed = ['Complete'].includes(uploadMachineState.value.toString())

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
            <button type="submit" className="flex flex-row gap-2 p-4 px-6 rounded-md bg-blue-500 ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none text-white font-semibold">
              <ArrowUpOnSquareIcon className="h-8 w-8 text-slate-100" />
              Upload
            </button>
          </div>
        </Form>
        <div className="w-1/2 flex gap-4">
          <div>Status:</div>
          <div className="text-blue-100 font-medium">
            {navigation.state === 'submitting'
              ? (<>
                <div className="flex gap-2">
                  <ArrowPathIcon className="animate-spin h-8 w-8 text-slate-100 " />
                  <span>Uploading...</span>
                </div>
              </>)
              : null}
            {uploadMachineState.value.toString() === 'inactive' ? 'None' : uploadMachineState.value.toString()}
          </div>
        </div>
        <div className="w-1/2 p-4 rounded-md ring-2 ring-blue-200 ring-offset-slate-900 ring-offset-4 border-none font-semibold">
          <div className="grid grid-cols-[50px_1fr_50px] gap-4 text-slate-500">
            <div className={`${hasUploaded ? 'text-slate-200' : ''}`}>1</div>
            <span className={`${hasUploaded ? 'text-slate-200' : ''}`}>Uploaded</span>
            <CheckCircleIcon className={`h-8 w-8 ${hasUploaded ? 'text-green-500' : ''}`} />
            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>2</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Processed</span>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : ''}`} />
            <div className={`${hasProcessed ? 'text-slate-200' : ''}`}>3</div>
            <span className={`${hasProcessed ? 'text-slate-200' : ''}`}>Complete</span>
            <CheckCircleIcon className={`h-8 w-8 ${hasProcessed ? 'text-green-500' : ''}`} />
          </div>
        </div>
        <div className="w-1/2 flex gap-4">
          <div>Uploaded Blob:</div>
          {uploadedBlobUrl ? <a href={uploadedBlobUrl} className="text-blue-100 font-medium">{uploadedBlobUrl}</a> : 'None'}
        </div>
      </div>
    </>
  )
}
