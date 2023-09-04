import { NavLink, useOutletContext } from "@remix-run/react"
import AbilityPreview from "~/components/AbilityPreview"
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { XmlJsonElement, groupByRace } from "~/utilities"

export default function Abilities() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const getMetaAttributes = (ability: XmlJsonElement) => ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}
        
    const { terran, zerg, protoss } = groupByRace(context.jsonContent.abilities, getMetaAttributes)

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
