import { useOutletContext } from "@remix-run/react"

export default function Ask() {
  const context = useOutletContext()
  console.log({ context })

  return <>
    <h1>Ask</h1>
  </>
}
