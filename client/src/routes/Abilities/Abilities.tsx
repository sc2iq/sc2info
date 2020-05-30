import React from 'react'
import { NavLink } from "react-router-dom"
import * as urlq from 'urql'
import AbilityPreview from '../../components/AbilityPreview'
import './Abilities.css'

const query = `
{
  abilities {
    id
    index
    command {
      id
      meta {
        name
        icon
        race
        hotkey
        source
        tooltip
      }
    }
  }
}
`

const Component: React.FC = () => {
    const [response] = urlq.useQuery({
        query,
    })

    const abilities: any[] = response.data?.abilities ?? []

    const groupedAbilities = {
        terran: abilities.filter(x => x).filter(a => a.command[0].meta.race === "terran").sort((a, b) => (a.id as string).localeCompare(b.id)),
        zerg: abilities.filter(x => x).filter(a => a.command[0].meta.race === "zerg"),
        protoss: abilities.filter(x => x).filter(a => a.command[0].meta.race === "protoss"),
    }

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; Abilities
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                <div className="race-lists">
                    <div>
                        <h2>Terran</h2>
                        <div className="ability-preview-list">
                            {groupedAbilities.terran.map((ability, i) =>
                                <AbilityPreview ability={ability} key={i} />
                            )}
                        </div>
                    </div>

                    <div>
                        <h2>Zerg</h2>
                        <div className="ability-preview-list">
                            {groupedAbilities.zerg.map((ability, i) =>
                                <AbilityPreview ability={ability} key={i} />
                            )}
                        </div>
                    </div>

                    <div>
                        <h2>Protoss</h2>
                        <div className="ability-preview-list">
                            {groupedAbilities.protoss.map((ability, i) =>
                                <AbilityPreview ability={ability} key={i} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Component 