import { NavLink, useOutletContext, useParams } from "@remix-run/react"
import WeaponFull from "~/components/WeaponFull"
import { loader as rootLoader } from "~/root"
import { convertCamelCaseToSpacedCase } from "~/utilities"

export default function Weapon() {
  const { weaponId } = useParams()
  
  const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
  const weapon = context.balanceData.unitWeapons.find(e => e.attributes?.id === weaponId)
  if (!weapon) {
    return <div>Could not find weapon with id {weaponId}</div>
  }

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/weapons" >Weapons</NavLink> &gt; {convertCamelCaseToSpacedCase(weaponId ?? '')}
    </h1>

    <section>
      <WeaponFull weapon={weapon} />
    </section>
  </>
}
