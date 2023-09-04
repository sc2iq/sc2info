import { Link, NavLink, useOutletContext } from "@remix-run/react"
import UpgradePreview from "~/components/UpgradePreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { groupByRace } from "~/utilities"

export default function Upgrades() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const { terran, zerg, protoss } = groupByRace(context.jsonContent.upgrades)

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
