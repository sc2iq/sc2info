import { DataFunctionArgs, LinksFunction } from "@remix-run/node"
import { Link, NavLink, useLoaderData } from "@remix-run/react"
import AbilityPreview from "~/components/AbilityPreview"
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'

export const links: LinksFunction = () => ([
    { rel: 'stylesheet', href: componentAbilityPrviewStyles },
])

export const loader = ({ }: DataFunctionArgs) => {
    return {
        terran: [],
        zerg: [],
        protoss: [],
    }
}

export default function Abilities() {
    const {
        terran,
        zerg,
        protoss,
    } = useLoaderData<typeof loader>()

    return <>
        <h1>
            <NavLink to="/browse" >Browse</NavLink> &gt; Abilities
        </h1>
        <div>
            <Link to="xyz">XYZ</Link>
        </div>
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
