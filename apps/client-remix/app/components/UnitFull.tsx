import React from 'react'
import RaceImg from './RaceImg'
import { Race, XmlJsonElement, convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'
import { useOutletContext } from '@remix-run/react'
import { getRaceFromString } from '~/helpers'
import { loader as rootLoader } from "~/root"

type Props = {
    unit: XmlJsonElement
}

type AbilityDisplay = {
    name: string
    icon: string
    attributes: [string, string][]
}

const UnitFull: React.FC<Props> = ({ unit }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = unit.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const race = getRaceFromString(metaAttributes.icon ?? '') as Race

    const elementNames = [
        'life',
        'armor',
        'shieldArmor',
        'cost',
        'attributes',
        'movement',
        'misc',
        'score',
    ]
    const attributesEntries = elementNames.map(elementName => {
        const attributesOfType = unit.elements?.find(e => e.name === elementName)?.attributes ?? {}
        return [elementName, attributesOfType]
    })
    const attributes = Object.fromEntries(attributesEntries)

    const abilities = [] as AbilityDisplay[]
    // const abilities = (unit.original.abilities as any[])
    //     .reduce<AbilityDisplay[]>((abilitiesGroup: AbilityDisplay[], ability: any) => {
    //         const remove = [/stop/i, /move/i, /attack/i,].some(regex => regex.test(ability.id))
    //         if (remove) {
    //             return abilitiesGroup
    //         }

    //         const abilityCommands = (ability?.command ?? [])
    //             .map((command: any) => {
    //                 let name = ability.id
    //                 if (command.id !== 'Execute') {
    //                     name += ` - ${command.id}`
    //                 }

    //                 let attributes: [string, string][] = [
    //                     ['Cooldown', command?.cost?.cooldown ?? ''],
    //                     ['Energy', command?.cost?.energy ?? ''],
    //                     ['Range', command?.misc?.range ?? ''],
    //                     ['Radius', command?.effect?.radius ?? ''],
    //                 ]

    //                 attributes = attributes.filter(([key, value]) => value !== '')

    //                 const unitAbility: AbilityDisplay = {
    //                     name: convertCamelCaseToSpacedCase(name),
    //                     icon: command.meta.icon,
    //                     attributes,
    //                 }

    //                 return unitAbility
    //             })

    //         abilitiesGroup.push(...abilityCommands)

    //         return abilitiesGroup
    //     }, [])

    return (
        <div className="unit-full">
            <div>
                <RaceImg race={race} />
                <IconImage url={iconUrl} width={150} height={150} />
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
                        <div>{attributes.life.start}</div>
                        <div>{attributes.armor.start}</div>
                        <div>{attributes.shieldArmor.start}</div>
                        <div>Max</div>
                        <div>{attributes.life.max}</div>
                        <div>{attributes.armor.max}</div>
                        <div>{attributes.shieldArmor.max}</div>

                        <div>Regeneration Rate</div>
                        <div>{attributes.life.regenRate}</div>
                        <div>{attributes.armor.regenRate}</div>
                        <div>{attributes.shieldArmor.regenRate}</div>

                        <div>Regeneration Delay</div>
                        <div>{attributes.life.delay}</div>
                        <div>{attributes.armor.delay}</div>
                        <div>{attributes.shieldArmor.delay}</div>
                    </div>
                </div>
                {Boolean(attributes.cost) && Object.keys(attributes.cost).length > 0
                    && (
                        <div>
                            <h2>Cost</h2>
                            <div className="unit-full__section">
                                <div>Minerals</div>
                                <div>{attributes.cost.minerals}</div>
                                <div>Vespene</div>
                                <div>{attributes.cost.vespene}</div>
                                <div>Time</div>
                                <div>{attributes.cost.time}</div>
                                <div>Supply</div>
                                <div>{attributes.cost.supply}</div>
                            </div>
                        </div>
                    )}

                {Boolean(attributes.attributes) && Object.keys(attributes.attributes).length > 0
                    && (
                        <div>
                            <h2>Attributes</h2>
                            <div className="unit-full__1col">
                                {attributes.attributes.map((attribute: string) =>
                                    <div>{attribute}</div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            <div className="unit-full__movement-misc-score">
                {attributes.movement
                    && (<div>
                        <h2>Movement</h2>
                        <div className="unit-full__section">
                            <div>Speed</div>
                            <div>{attributes.movement.speed}</div>
                            <div>Acceleration</div>
                            <div>{attributes.movement.acceleration}</div>
                            <div>Deceleration</div>
                            <div>{attributes.movement.deceleration}</div>
                            <div>Turn Rate</div>
                            <div>{attributes.movement.turnRate}</div>
                        </div>
                    </div>)}

                <div>
                    <h2>Miscellaneous</h2>
                    <div className="unit-full__section">
                        <div>Radius</div>
                        <div>{attributes.misc.radius}</div>
                        <div>Cargo Size</div>
                        <div>{attributes.misc.cargoSize}</div>
                        <div>Foot Print</div>
                        <div>{attributes.misc.footprint}</div>
                        <div>Sight Radius</div>
                        <div>{attributes.misc.sightRadius}</div>
                        <div>Supply</div>
                        <div>{attributes.misc.supply}</div>
                        <div>Speed</div>
                        <div>{attributes.misc.speed}</div>
                        <div>Targets</div>
                        <div>{attributes.misc.targets}</div>
                    </div>
                </div>

                <div>
                    <h2>Score</h2>
                    <div className="unit-full__section">
                        <div>Build</div>
                        <div>{attributes.score.build}</div>
                        <div>Kill</div>
                        <div>{attributes.score.kill}</div>
                    </div>
                </div>
            </div>

        {/* 
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
                                                <div>{l.meta.name}</div>
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
             */}

        </div >

    )
}

export default UnitFull
