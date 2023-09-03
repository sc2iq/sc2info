import { Link, NavLink, useLoaderData, useOutletContext } from "@remix-run/react"
import UpgradePreview from "~/components/UpgradePreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"

export default function Weapons() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const weaponsWithRace = context.jsonContent.unitWeapons.map(e => {
        const metaAttributes = e.elements?.find(we => we.name === 'meta')?.attributes
        const race = getRaceFromString(metaAttributes?.icon ?? '')

        return {
            race,
            weapon: e,
        }
    })

    const terran = weaponsWithRace.filter(x => x.race === 'terran').map(x => x.weapon)
    const zerg = weaponsWithRace.filter(x => x.race === 'zerg').map(x => x.weapon)
    const protoss = weaponsWithRace.filter(x => x.race === 'protoss').map(x => x.weapon)

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
