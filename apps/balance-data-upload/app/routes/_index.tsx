import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import '../types.d.ts'
import { useEffect, useRef, useState } from "react"
import { ArrowPathIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/solid'
import { containerClient } from "~/services/blobService"

export const action = async ({ request }: ActionArgs) => {
  console.log(`File Upload Action: `, { request })

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
  console.log({ balanceDataFiles })

  for (const balanceDataFile of balanceDataFiles) {
    console.log({ balanceDataFile })
    const filename = `balancedata_${Date.now()}.zip`
    const fileBuffer = await balanceDataFile.arrayBuffer()
    await containerClient.uploadBlockBlob(filename, fileBuffer, fileBuffer.byteLength)

    return {
      'uploadstatus': 'success',
    }
  }

  return null
}

export default function Index() {
  const navigation = useNavigation()
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const actionData = useActionData<typeof action>()

  const folderPickerChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(`Folder Picker Change: `, { event })
    const files = [...event.target?.files ?? []]
    setFiles(files)
    console.log({ files })
  }

  // After form is submitted, reset the form
  useEffect(() => {
    if (actionData?.uploadstatus === "success") {
      folderPickerRef.current?.form?.reset()
      setFiles([])
    }
  }, [actionData, files])

  return (
    <>
      <div className="flex flex-col gap-6 items-center p-10 text-2xl text-blue-100">
        <h1 className="text-6xl font-bold text-slate-50">SC2 Balance Data Upload</h1>
        <h2 className="text-4xl font-semibold">Instructions</h2>
        <div className="flex gap-10 mb-5">
          <div className="flex flex-col gap-3">
            <div><b>1.</b> Open SC2Editor</div>
            <img src="/images/step1_open_editor.png" alt="The icon for SC2 Editor" width="250" className="ring-2 ring-blue-400 ring-offset-slate-800 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>2.</b> Export Balance Data to Folder</div>
            <img src="/images/step2_export_balance_data.png" alt="The file menu of SC2 editor application. Export Balance Data > Legacy of the Void" width="450" className="ring-2 ring-blue-400 ring-offset-slate-800 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>3.</b> Compress folder to .zip file</div>
            <img src="/images/step3_compress_folder.png" alt="Right click menu on balance data folder with 'Compress as Zip file' highlighted" width="350" className="ring-2 ring-blue-400 ring-offset-slate-800 ring-offset-4 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div><b>4.</b> Upload .zip file</div>
            <img src="/images/step4_upload_zip_file.png" alt="File explorer with .zip file highlighted" width="250" className="ring-2 ring-blue-400 ring-offset-slate-800 ring-offset-4 rounded-2xl" />
          </div>
        </div>
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-8 items-center">
          <label htmlFor="filepicker" className="text-3xl font-semibold">Upload Balance Data .zip File:</label>
          <input
            ref={folderPickerRef}
            type="file"
            id="filepicker"
            name="files"
            placeholder="Choose"
            onChange={folderPickerChange}
            required
            className="p-4 rounded-md bg-slate-200 ring-2 ring-blue-200 ring-offset-slate-800 ring-offset-4 border-none text-slate-800 font-semibold cursor-pointer"
          />
          <div>
            <button type="submit" className="flex flex-row gap-2 p-4 px-6 rounded-md bg-blue-500 ring-2 ring-blue-200 ring-offset-slate-800 ring-offset-4 border-none text-white font-semibold">
              <ArrowUpOnSquareIcon className="h-8 w-8 text-slate-100" />
              Upload
            </button>
          </div>
        </Form>
        <div className="w-1/3 flex gap-4">
          <div>Status:</div>
          <div className="text-blue-100 font-medium">
            {navigation.state === 'submitting'
              ? (<>
                <div className="flex gap-2">
                  <ArrowPathIcon className="animate-spin h-8 w-8 text-slate-100 " />
                  <span>Uploading...</span>
                </div>
              </>)
              : 'None'}
          </div>
        </div>
        <div className="w-1/3">
          <h3>Files ({files.length}):</h3>
          {files.length === 0
            ? <div>No Files</div>
            : (
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{index + 1}: {file.webkitRelativePath || file.name}</li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </>
  )
}
