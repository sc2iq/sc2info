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

const AbilitiesRoute: React.FC = () => {
    const [response] = urlq.useQuery({
        query,
    })

    const abilities: any[] = response.data?.abilities ?? []

    const terranAbilities = abilities
        .filter(x => x)
        .filter(a => a.command[0].meta.race === "terran")
        .reduce<Map<string, any>>((map, ability) => {
            map.set(ability.id, ability)
            return map
        }, new Map<string, any>())
        .values()

    const sortedTerranAbilities = [...terranAbilities]
        .sort((a, b) => (a.id as string).localeCompare(b.id))

    const groupedAbilities = {
        terran: sortedTerranAbilities,
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

export default AbilitiesRoute 