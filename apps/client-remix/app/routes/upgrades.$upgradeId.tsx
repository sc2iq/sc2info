import { NavLink, useOutletContext, useParams } from "@remix-run/react"
import UpgradeFull from "~/components/UpgradeFull"
import { convertCamelCaseToSpacedCase } from "~/utilities"
import { loader as rootLoader } from "~/root"

export default function Unit() {
  const { upgradeId } = useParams()
  
  const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
  const upgrade = context.balanceData.upgrades.find(e => e.attributes?.id === upgradeId)
  if (!upgrade) {
    return <div>Could not find upgrade with id {upgradeId}</div>
  }

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/upgrades" >Upgrades</NavLink> &gt; {convertCamelCaseToSpacedCase(upgradeId ?? '')}
    </h1>

    <section>
      <UpgradeFull upgrade={upgrade} />
    </section>
  </>
}
