import { useOutletContext } from "@remix-run/react"

export default function Ask() {
  const context = useOutletContext()

  return <>
    <h1>Ask</h1>
  </>
}
