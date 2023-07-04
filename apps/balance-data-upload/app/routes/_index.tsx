import { unstable_parseMultipartFormData, type ActionArgs, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler } from "@remix-run/node"
import { Form, useNavigation } from "@remix-run/react"
import '../types.d.ts'
import { useEffect, useRef, useState } from "react"

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

  const balanceDataFiles = formData.getAll("files")
  console.log({ balanceDataFiles })

  // success! Redirect to account page
  return null
}

export default function Index() {

  const navigation = useNavigation()
  const folderPickerRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  const folderPickerChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(`Folder Picker Change: `, { event })
    const files = [...event.target?.files ?? []]
    setFiles(files)
    console.log({ files })
  }

  return (
    <>
      <div className="flex flex-col gap-6 items-center p-10">
        <h1 className="text-6xl font-bold text-slate-50">SC2 Balance Data Upload</h1>
        <h2 className="text-4xl font-semibold">Instructions</h2>
        <div className="flex gap-10 mb-5">
          <div className="flex flex-col gap-3">
            <div className="text-2xl"><b>1.</b> Open SC2Editor</div>
            <img src="/images/step1_open_editor.png" alt="The icon for SC2 Editor" width="250" className="border-blue-300 border-spacing-4 border-2 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-2xl"><b>2.</b> Export Balance Data to Folder</div>
            <img src="/images/step2_export_balance_data.png" alt="The file menu of SC2 editor application. Export Balance Data > Legacy of the Void" width="450" className="border-blue-300 border-spacing-4 border-2 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-2xl"><b>3.</b> Compress folder to .zip file</div>
            <img src="/images/step3_compress_folder.png" alt="Right click menu on balance data folder with 'Compress as Zip file' highlighted" width="350" className="border-blue-300 border-spacing-4 border-2 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-2xl"><b>4.</b> Upload .zip file</div>
            <img src="/images/step4_upload_zip_file.png" alt="File explorer with .zip file highlighted" width="250" className="border-blue-300 border-spacing-4 border-2 rounded-2xl" />
          </div>
        </div>
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-5 items-center">
          <label htmlFor="filepicker" className="text-2xl">Upload Balance Data .zip File:</label>
          <input
            ref={folderPickerRef}
            type="file"
            id="filepicker"
            name="files"
            multiple
            // webkitdirectory is not a valid TypeScript attribute
            // @ts-ignore
            webkitdirectory="true"
            placeholder="Choose"
            onChange={folderPickerChange}
            required
            className="p-4 border-spacing-2 border-cyan-100 bg-slate-50 rounded-2xl text-slate-900 cursor-pointer"
          />
          <div>
            <button type="submit" className="p-4  border-2 border-cyan-300 bg-slate-300 rounded-xl">Upload</button>
          </div>
        </Form>
        {navigation.state === 'submitting' && (
          <div>Uploading...</div>
        )}
        <h3>Files ({files.length}):</h3>
        {files.length === 0
          ? <div>No Files</div>
          : (
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.webkitRelativePath ?? file.name}</li>
              ))}
            </ul>
          )}
      </div>
    </>
  )
}
