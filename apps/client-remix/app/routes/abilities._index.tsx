import { NavLink, useOutletContext } from "@remix-run/react"
import AbilityPreview from "~/components/AbilityPreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { XmlJsonElement } from "~/utilities"

export default function Abilities() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const abilitiesByRace = context.jsonContent.abilities.map(a => {
        const abilityMetaAttributes = a
            .elements?.find(e => e?.name === "command")
            ?.elements?.find(e => e?.name === "meta")
            ?.attributes ?? {}

        const abilityRace = getRaceFromString(abilityMetaAttributes?.icon ?? '')

        return {
            race: abilityRace,
            ability: a,
        }
    })

    const terran = abilitiesByRace.filter(a => a.race === "terran").map(a => a.ability as XmlJsonElement)
    const zerg = abilitiesByRace.filter((a: any) => a.race === "zerg").map((a: any) => a.ability as XmlJsonElement)
    const protoss = abilitiesByRace.filter((a: any) => a.race === "protoss").map((a: any) => a.ability as XmlJsonElement)

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Abilities
        </h1>
        <section>
            <div className="race-lists">
                <div>
                    <h2>Terran</h2>
                    <div className="ability-preview-list">
                        {terran.map((ability, i) =>
                            <AbilityPreview ability={ability} key={i} />
                        )}
                    </div>
                </div>

                <div>
                    <h2>Zerg</h2>
                    <div className="ability-preview-list">
                        {zerg.map((ability, i) =>
                            <AbilityPreview ability={ability} key={i} />
                        )}
                    </div>
                </div>

                <div>
                    <h2>Protoss</h2>
                    <div className="ability-preview-list">
                        {protoss.map((ability, i) =>
                            <AbilityPreview ability={ability} key={i} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    </>
}
