import { DataFunctionArgs } from "@remix-run/node"
import { NavLink, useLoaderData } from "@remix-run/react"
import UnitFull from "~/components/UnitFull"

export const loader = ({ params }: DataFunctionArgs) => {
  const unitId = params.unitId

  return {
    unitId
  }
}

export default function Unit() {
  const { unitId } = useLoaderData()

  return <>
  <h1>
    <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/units" >Units</NavLink> &gt; {unitId}
  </h1>

  <section>
    {/* <UnitFull unit={response.data.unit} /> */}
  </section>
  </>
}
