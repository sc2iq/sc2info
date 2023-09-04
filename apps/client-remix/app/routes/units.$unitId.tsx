import { DataFunctionArgs } from "@remix-run/node"
import { NavLink, useLoaderData, useOutletContext, useParams } from "@remix-run/react"
import UnitFull from "~/components/UnitFull"
import { convertCamelCaseToSpacedCase } from "~/utilities"
import { loader as rootLoader } from "~/root"

export default function Unit() {
  const { unitId } = useParams()

  const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
  const unit = context.jsonContent.unitsWithWeapons.find(e => e.attributes?.id === unitId)
  if (!unit) {
    return <div>Could not find unit with id {unitId}</div>
  }

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/units" >Units</NavLink> &gt; {convertCamelCaseToSpacedCase(unitId ?? '')}
    </h1>

    <section>
      <UnitFull unit={unit} />
    </section>
  </>
}
