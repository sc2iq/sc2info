import { DataFunctionArgs } from "@remix-run/node"
import { Link, NavLink, useOutletContext } from "@remix-run/react"
import UpgradePreview from "~/components/UpgradePreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"

export const loader = ({ }: DataFunctionArgs) => {
    return {
        terran: [] as any[],
        zerg: [] as any[],
        protoss: [] as any[],
    }
}

export default function Upgrades() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const upgradesWithRace = context.jsonContent.upgrades.map(be => {
        const metaAttributes = be.elements?.find(e => e.name === 'meta')?.attributes
        const race = getRaceFromString(metaAttributes?.icon ?? '')

        return {
            race,
            building: be,
        }
    })
    const terran = upgradesWithRace.filter(x => x.race === 'terran').map(x => x.building)
    const zerg = upgradesWithRace.filter(x => x.race === 'zerg').map(x => x.building)
    const protoss = upgradesWithRace.filter(x => x.race === 'protoss').map(x => x.building)


    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Upgrades
        </h1>

        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((upgrade, i) => {
                            return (
                                <Link key={i} to={upgrade.attributes?.id ?? ''}>
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
                                <Link key={i} to={upgrade.attributes?.id ?? ''}>
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
                                <Link key={i} to={upgrade.attributes?.id ?? ''}>
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
