import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useLoaderData } from "@remix-run/react"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'
import UnitPreview from "~/components/UnitPreview"

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

export default function Units() {
    const {
        terran,
        zerg,
        protoss,
    } = useLoaderData<typeof loader>()

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
                                <Link key={i} to={unit.id}>
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
                                <Link key={i} to={unit.id}>
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
                                <Link key={i} to={unit.id}>
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
