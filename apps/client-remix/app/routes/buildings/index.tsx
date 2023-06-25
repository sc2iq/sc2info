import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useLoaderData } from "@remix-run/react"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'
import BuildingPreview from "~/components/BuildingPreview"

export const links: LinksFunction = () => ([
    { rel: 'stylesheet', href: componentAbilityPrviewStyles },
])

export const loader = ({ }: DataFunctionArgs) => {
    return {
        terran: [] as any[],
        zerg: [] as any[],
        protoss: [] as any[],
    }
}

export default function Buildings() {
    const {
        terran,
        zerg,
        protoss,
    } = useLoaderData<typeof loader>()

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Buildings
        </h1>
        <div>
            <Link to="xyz">XYZ</Link>
        </div>

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
