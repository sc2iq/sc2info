import { Link, NavLink, useOutletContext } from "@remix-run/react"
import BuildingPreview from "~/components/BuildingPreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"

export default function Buildings() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const buildingsWithRace = context.jsonContent.buildings.map(be => {
        const metaAttributes = be.elements?.find(e => e.name === 'meta')?.attributes
        const race = getRaceFromString(metaAttributes?.icon ?? '')

        return {
            race,
            building: be,
        }
    })
    const terran = buildingsWithRace.filter(x => x.race === 'terran').map(x => x.building)
    const zerg = buildingsWithRace.filter(x => x.race === 'zerg').map(x => x.building)
    const protoss = buildingsWithRace.filter(x => x.race === 'protoss').map(x => x.building)

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Buildings
        </h1>
        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((building, i) => {
                            return (
                                <Link key={i} to={building.attributes?.id ?? ''}>
                                    <BuildingPreview building={building} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((building, i) => {
                            return (
                                <Link key={i} to={building.attributes?.id ?? ''}>
                                    <BuildingPreview building={building} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((building, i) => {
                            return (
                                <Link key={i} to={building.attributes?.id ?? ''}>
                                    <BuildingPreview building={building} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}
