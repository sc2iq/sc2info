import { NavLink, useOutletContext, useParams } from "@remix-run/react"
import { convertCamelCaseToSpacedCase } from "~/utilities"
import { loader as rootLoader } from "~/root"
import BuildingFull from "~/components/BuildingFull"

export default function Building() {
  const { buildingId } = useParams()
  
  const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
  const building = context.balanceData.buildings.find(e => e.attributes?.id === buildingId)
  if (!building) {
    return <div>Could not find building with id {buildingId}</div>
  }

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/buildings" >Buildings</NavLink> &gt; {convertCamelCaseToSpacedCase(buildingId ?? '')}
    </h1>
    <section>
      <BuildingFull building={building} />
    </section>
  </>
}
