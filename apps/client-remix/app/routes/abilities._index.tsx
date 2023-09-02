import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useLoaderData, useOutletContext } from "@remix-run/react"
import AbilityPreview from "~/components/AbilityPreview"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'
import { getRaceFromString } from "~/helpers"
import { loader as rootLoader } from "~/root"
import { XmlJsonElement, XmlRootElement } from "~/utilities"

export const links: LinksFunction = () => ([
    { rel: 'stylesheet', href: componentAbilityPrviewStyles },
])

export default function Abilities() {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const abilitiesByRace =context.jsonContent.abilities.map((a: XmlRootElement) => {
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

    const terran: XmlJsonElement[] = abilitiesByRace.filter((a: any) => a.race === "terran").map((a: any) => a.ability as XmlJsonElement)
    const zerg: any[] = abilitiesByRace.filter((a: any) => a.race === "zerg").map((a: any) => a.ability as XmlJsonElement)
    const protoss: any[] = abilitiesByRace.filter((a: any) => a.race === "protoss").map((a: any) => a.ability as XmlJsonElement)

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
