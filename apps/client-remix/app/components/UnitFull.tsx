import React from 'react'
import RaceImg from './RaceImg'
import { convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    unit: any
}

type AbilityDisplay = {
    name: string
    icon: string
    attributes: [string, string][]
}

const UnitFull: React.FC<Props> = ({ unit }) => {

    const abilities = (unit.original.abilities as any[])
        .reduce<AbilityDisplay[]>((abilitiesGroup: AbilityDisplay[], ability: any) => {
            const remove = [/stop/i, /move/i, /attack/i,].some(regex => regex.test(ability.id))
            if (remove) {
                return abilitiesGroup
            }

            const abilityCommands = (ability?.command ?? [])
                .map((command: any) => {
                    let name = ability.id
                    if (command.id !== 'Execute') {
                        name += ` - ${command.id}`
                    }

                    let attributes: [string, string][] = [
                        ['Cooldown', command?.cost?.cooldown ?? ''],
                        ['Energy', command?.cost?.energy ?? ''],
                        ['Range', command?.misc?.range ?? ''],
                        ['Radius', command?.effect?.radius ?? ''],
                    ]

                    attributes = attributes.filter(([key, value]) => value !== '')

                    const unitAbility: AbilityDisplay = {
                        name: convertCamelCaseToSpacedCase(name),
                        icon: command.meta.icon,
                        attributes,
                    }

                    return unitAbility
                })

            abilitiesGroup.push(...abilityCommands)

            return abilitiesGroup
        }, [])

    return (
        <div className="unit-full">
            <div>
                <RaceImg race={unit.meta.race} />
                <IconImage url={unit.meta.icon} width={150} height={150} />
            </div>

            <div className="unit-full__lift-cost">
                <div>
                    <h2>Life</h2>
                    <div className="unit-full__life">
                        <b></b>
                        <div>Life</div>
                        <div>Armor</div>
                        <div>Shield Armor</div>
                        <div>Start</div>
                        <div>{unit.life.start}</div>
                        <div>{unit.armor.start}</div>
                        <div>{unit.shieldArmor.start}</div>
                        <div>Max</div>
                        <div>{unit.life.max}</div>
                        <div>{unit.armor.max}</div>
                        <div>{unit.shieldArmor.max}</div>

                        <div>Regeneration Rate</div>
                        <div>{unit.life.regenRate}</div>
                        <div>{unit.armor.regenRate}</div>
                        <div>{unit.shieldArmor.regenRate}</div>

                        <div>Regeneration Delay</div>
                        <div>{unit.life.delay}</div>
                        <div>{unit.armor.delay}</div>
                        <div>{unit.shieldArmor.delay}</div>
                    </div>
                </div>

                {unit.cost
                    && (
                        <div>
                            <h2>Cost</h2>
                            <div className="unit-full__section">
                                <div>Minerals</div>
                                <div>{unit.cost.minerals}</div>
                                <div>Vespene</div>
                                <div>{unit.cost.vespene}</div>
                                <div>Time</div>
                                <div>{unit.cost.time}</div>
                                <div>Supply</div>
                                <div>{unit.cost.supply}</div>
                            </div>
                        </div>
                    )}

                {unit.attributes
                    && (
                        <div>
                            <h2>Attributes</h2>
                            <div className="unit-full__1col">
                                {unit.attributes.map((attribute: string) =>
                                    <div>{attribute}</div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            <div className="unit-full__movement-misc-score">
                {unit.movement
                    && (<div>
                        <h2>Movement</h2>
                        <div className="unit-full__section">
                            <div>Speed</div>
                            <div>{unit.movement.speed}</div>
                            <div>Acceleration</div>
                            <div>{unit.movement.acceleration}</div>
                            <div>Deceleration</div>
                            <div>{unit.movement.deceleration}</div>
                            <div>Turn Rate</div>
                            <div>{unit.movement.turnRate}</div>
                        </div>
                    </div>)}

                <div>
                    <h2>Miscellaneous</h2>
                    <div className="unit-full__section">
                        <div>Radius</div>
                        <div>{unit.misc.radius}</div>
                        <div>Cargo Size</div>
                        <div>{unit.misc.cargoSize}</div>
                        <div>Foot Print</div>
                        <div>{unit.misc.footprint}</div>
                        <div>Sight Radius</div>
                        <div>{unit.misc.sightRadius}</div>
                        <div>Supply</div>
                        <div>{unit.misc.supply}</div>
                        <div>Speed</div>
                        <div>{unit.misc.speed}</div>
                        <div>Targets</div>
                        <div>{unit.misc.targets}</div>
                    </div>
                </div>

                <div>
                    <h2>Score</h2>
                    <div className="unit-full__section">
                        <div>Build</div>
                        <div>{unit.score.build}</div>
                        <div>Kill</div>
                        <div>{unit.score.kill}</div>
                    </div>
                </div>
            </div>

            <div className="unit-full-50-50">
                <div>
                    <h2>Weapons</h2>
                    <div className="unit-full__list">
                        {((unit.original?.weapons as any[]) ?? []).map((u, i) => {
                            return <div key={i} className="unit-full__weapon">
                                <img className="unit-full__weapon-img" src={u.meta.icon} alt={u.meta.name} />
                                <div>
                                    <h3>{convertCamelCaseToSpacedCase(u.meta.name)}</h3>
                                    <div className="unit-full__weapon-stats">
                                        <div>Range</div><div>{u.misc.range}</div>
                                        <div>Speed</div><div>{u.misc.speed}</div>
                                        <div>Targets</div><div>{u.misc.targets}</div>
                                        <div>Max</div><div>{u.effect.max}</div>
                                        <div>Kind</div><div>{u.effect.kind}</div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>

                    <h2>Abilities</h2>
                    <div className="unit-full__list">
                        {abilities.map(ability => {
                            return <div key={ability.name} className="unit-full__weapon">
                                <img className="unit-full__weapon-img" src={ability.icon} alt={ability.name} />
                                <div>
                                    <h3>{ability.name}</h3>
                                    <div className="unit-full__weapon-stats">
                                        {ability.attributes.map(([key, value], i) => 
                                            <React.Fragment key={i}>
                                                <div>{key}</div>
                                                <div>{value}</div>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div>
                    <h2>Upgrades</h2>
                    <div>
                        {(unit.original.upgrades as any[]).map((u, i) => {
                            return <div key={i} className="unit-full__upgrade">
                                <h3>{convertCamelCaseToSpacedCase(u.name)}</h3>
                                <div className="unit-full__upgrade-levels">

                                    {(u.levels as any[]).map((l, j) => (
                                        <div key={j}>
                                            <div>
                                                <IconImage url={l.meta.icon} />
                                            </div>
                                            <div className="unit-full__upgrade-stats">
                                                {/* <div>{l.meta.name}</div> */}
                                                <img src="https://sc2iq.blob.core.windows.net/sc2icons/Wireframe-General-MineralField.png" width={30} height={30} alt="Minerals" />
                                                <div>{l.cost.minerals}</div>
                                                <img src="https://sc2iq.blob.core.windows.net/sc2icons/Wireframe-General-VespeneGeyser.png" width={30} height={30} alt="Vespene" />
                                                <div>{l.cost.vespene}</div>
                                                <div className="icon-time"><span role="img" aria-label="Time">🕖</span></div>
                                                <div>{l.cost.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>

            <div className="unit-full-50-50">
                <div>
                    <h2>Strengths</h2>
                    <ul>
                        {(unit.original.strengths as any[]).map(strength =>
                            <li key={strength.name}>{convertCamelCaseToSpacedCase(strength.name)}</li>
                        )}
                    </ul>
                </div>
                <div>
                    <h2>Weaknesses</h2>
                    <ul>
                        {(unit.original.weaknesses as any[]).map(strength =>
                            <li key={strength.name}>{convertCamelCaseToSpacedCase(strength.name)}</li>
                        )}
                    </ul>
                </div>
            </div>

        </div >

    )
}

export default UnitFull
