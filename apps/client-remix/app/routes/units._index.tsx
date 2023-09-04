import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useOutletContext } from "@remix-run/react"
import UnitPreview from "~/components/UnitPreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { groupByRace } from "~/utilities"

export default function Units() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const { terran, zerg, protoss } = groupByRace(context.balanceData.unitsWithWeapons)

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
