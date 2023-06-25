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
      <h1 className="text-3xl font-bold underline">
        SC2 Balance Data Upload
      </h1>
      <h2>Form</h2>
      <Form method="post" encType="multipart/form-data">
        <label htmlFor="filepicker">Balance Data Directory</label>
        <input
          ref={folderPickerRef}
          type="file"
          id="filepicker"
          name="files"
          multiple
          webkitdirectory="true"
          placeholder="Choose"
          onChange={folderPickerChange}
          required />
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
        <div>

          <button type="submit">Upload</button>
        </div>
      </Form>
    </>
  )
}
