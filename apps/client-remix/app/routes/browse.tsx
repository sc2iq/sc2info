import { NavLink, useLoaderData, useOutletContext } from "@remix-run/react"

export const loader = () => {
  const iconsContainerUrl = process.env.ICONS_CONTAINER_URL

  return {
    iconsContainerUrl,
  }
}

export default function Browse() {
  const context = useOutletContext()
  const loaderData = useLoaderData<typeof loader>()
  console.log({ context })

  return <>
    <h1>Browse</h1>

    <section>
      <div className="browse-list">
        <div>
          <NavLink to={`/abilities`}>
            <div><img src={`${loaderData.iconsContainerUrl}/btn-command-attack.png`} alt="abilities" /></div>
            <div>Abilities</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/buildings`}>
            <div><img src={`${loaderData.iconsContainerUrl}/btn-building-terran-barracks.png`} alt="buildings" /></div>
            <div>Buildings</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/weapons`}>
            <div><img src={`${loaderData.iconsContainerUrl}/btn-upgrade-terran-infantryweaponslevel0.png`} alt="weapons" /></div>
            <div>Weapons</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/units`}>
            <div><img src={`${loaderData.iconsContainerUrl}/btn-unit-terran-marine.png`} alt="units" /></div>
            <div>Units</div>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/upgrades`}>
            <img src={`${loaderData.iconsContainerUrl}/btn-upgrade-terran-shipweaponslevel1.png`} alt="upgrades" />
            <div>Upgrades</div>
          </NavLink>
        </div>
      </div>
    </section>
  </>
}
