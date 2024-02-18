import { Link, NavLink, useLocation, useOutletContext } from "@remix-run/react"
import AbilityPreview from "~/components/AbilityPreview"
import { loader as rootLoader } from "~/root"
import { XmlJsonElement, convertCamelCaseToSpacedCase, groupByRace } from "~/utilities"

export default function Abilities() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const getMetaAttributes = (ability: XmlJsonElement) => ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}

    const { terran, zerg, protoss } = groupByRace(context.balanceData.abilities, getMetaAttributes)
    const { hash } = useLocation()

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Abilities
        </h1>
        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((ability, i) => {
                            let name = convertCamelCaseToSpacedCase(ability.attributes?.id ?? '')
                            name = name.replace(/\s/g, '').replace('%20', '').toLowerCase()
                            const isSelected = name == hash.replace('#', '')

                            return (
                                <Link to={`#${name}`} id={name} key={i}>
                                    <AbilityPreview ability={ability} isSelected={isSelected} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((ability, i) => {
                            let name = convertCamelCaseToSpacedCase(ability.attributes?.id ?? '')
                            name = name.replace(/\s/g, '').replace('%20', '').toLowerCase()
                            const isSelected = name == hash.replace('#', '')

                            return (
                                <Link to={`#${name}`} id={name} key={i}>
                                    <AbilityPreview ability={ability} isSelected={isSelected} />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((ability, i) => {
                            let name = convertCamelCaseToSpacedCase(ability.attributes?.id ?? '')
                            name = name.replace(/\s/g, '').replace('%20', '').toLowerCase()
                            const isSelected = name == hash.replace('#', '')

                            return (
                                <Link to={`#${name}`} id={name} key={i}>
                                    <AbilityPreview ability={ability} isSelected={isSelected} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    </>
}
