import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useLoaderData } from "@remix-run/react"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'
import UpgradePreview from "~/components/UpgradePreview"

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

export default function Upgrades() {
    const {
        terran,
        zerg,
        protoss,
    } = useLoaderData<typeof loader>()

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Upgrades
        </h1>
        <div>
            <Link to="xyz">XYZ</Link>
        </div>

        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((upgrade, i) => {
                            return (
                                <Link key={i} to={upgrade.id}>
                                    <UpgradePreview upgrade={upgrade} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((upgrade, i) => {
                            return (
                                <Link key={i} to={upgrade.id}>
                                    <UpgradePreview upgrade={upgrade} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((upgrade, i) => {
                            return (
                                <Link key={i} to={upgrade.id}>
                                    <UpgradePreview upgrade={upgrade} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}
