import { Link, NavLink, useOutletContext } from "@remix-run/react"
import UpgradePreview from "~/components/UpgradePreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { groupByRace } from "~/utilities"

export default function Weapons() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const { terran, zerg, protoss } = groupByRace(context.balanceData.unitWeapons)

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Weapons
        </h1>

        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((weapon, i) => {
                            return (
                                <Link key={i} to={weapon.attributes?.id ?? ''}>
                                    <UpgradePreview upgrade={weapon} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((weapon, i) => {
                            return (
                                <Link key={i} to={weapon.attributes?.id ?? ''}>
                                    <UpgradePreview upgrade={weapon} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((weapon, i) => {
                            return (
                                <Link key={i} to={weapon.attributes?.id ?? ''}>
                                    <UpgradePreview upgrade={weapon} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}
