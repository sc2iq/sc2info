import { NavLink, useOutletContext } from "@remix-run/react"
import { loader as rootLoader } from "~/root"

export default function Browse() {
  const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
  console.log({ context })

  return <>
    <h1>Browse</h1>

    <section>
      <div className="browse-list">
        <div>
          <NavLink to={`/abilities`}>
            <div><img src={`${context.iconsContainerUrl}/btn-command-attack.png`} alt="abilities" /></div>
            <div>Abilities</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/buildings`}>
            <div><img src={`${context.iconsContainerUrl}/btn-building-terran-barracks.png`} alt="buildings" /></div>
            <div>Buildings</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/weapons`}>
            <div><img src={`${context.iconsContainerUrl}/btn-upgrade-terran-infantryweaponslevel0.png`} alt="weapons" /></div>
            <div>Weapons</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/units`}>
            <div><img src={`${context.iconsContainerUrl}/btn-unit-terran-marine.png`} alt="units" /></div>
            <div>Units</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/upgrades`}>
            <img src={`${context.iconsContainerUrl}/btn-upgrade-terran-shipweaponslevel1.png`} alt="upgrades" />
            <div>Upgrades</div>
          </NavLink>
        </div>
      </div>
    </section>
  </>
}
