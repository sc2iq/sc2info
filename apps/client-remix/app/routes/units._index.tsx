import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useOutletContext } from "@remix-run/react"
import UnitPreview from "~/components/UnitPreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"

export default function Units() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const unitsWithRace = context.jsonContent.unitsWithWeapons.map(be => {
        const metaAttributes = be.elements?.find(e => e.name === 'meta')?.attributes
        const race = getRaceFromString(metaAttributes?.icon ?? '')

        return {
            race,
            unit: be,
        }
    })
    const terran = unitsWithRace.filter(x => x.race === 'terran').map(x => x.unit)
    const zerg = unitsWithRace.filter(x => x.race === 'zerg').map(x => x.unit)
    const protoss = unitsWithRace.filter(x => x.race === 'protoss').map(x => x.unit)

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Units
        </h1>

        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((unit, i) => {
                            return (
                                <Link key={i} to={unit.attributes?.id ?? ''}>
                                    <UnitPreview unit={unit} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((unit, i) => {
                            return (
                                <Link key={i} to={unit.attributes?.id ?? ''}>
                                    <UnitPreview unit={unit} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((unit, i) => {
                            return (
                                <Link key={i} to={unit.attributes?.id ?? ''}>
                                    <UnitPreview unit={unit} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}
