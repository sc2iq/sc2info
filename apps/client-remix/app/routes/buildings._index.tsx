import { LinksFunction } from "@remix-run/node"
import { Link, NavLink, useOutletContext } from "@remix-run/react"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'
import BuildingPreview from "~/components/BuildingPreview"
import { loader as rootLoader } from "~/root"

export const links: LinksFunction = () => ([
    { rel: 'stylesheet', href: componentAbilityPrviewStyles },
])

export default function Buildings() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const terran: any[] = []
    const zerg: any[] = []
    const protoss: any[] = []

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
                                <Link key={i} to={building.id}>
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
                                <Link key={i} to={building.id}>
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
                                <Link key={i} to={building.id}>
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
