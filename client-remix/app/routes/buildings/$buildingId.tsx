import { DataFunctionArgs } from "@remix-run/node"
import { NavLink, useLoaderData } from "@remix-run/react"

export const loader = ({ params }: DataFunctionArgs) => {
  const buildingId = params.buildingId

  return {
    buildingId
  }
}

export default function Building() {
  const { buildingId } = useLoaderData()

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/buildings" >Buildings</NavLink> &gt; {buildingId}
    </h1>
    <section>
      {/* <BuildingFull building={response.data.building} />} */}
    </section>
  </>
}
