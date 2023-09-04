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
        'weapons'
    ]

    const unitCategorizedAttributes = Object.fromEntries(elementNames.map(elementName => {
        const attributesOfType = unit.elements?.find(e => e.name === elementName)?.attributes ?? {}
        return [elementName, attributesOfType]
    }))

    const unitCategorizedQualities = (unit.elements?.find(e => e.name === 'attributes')?.elements ?? [])
        .map(e => e.attributes?.type ?? '') ?? []

    const stringNames = [
        'strengths',
        'weaknesses'
    ]
    const unitCategorizedStringAttributes = Object.fromEntries(stringNames.map(elementName => {
        const elementsOfType = unit.elements?.find(e => e.name === elementName)?.elements ?? []
        const stringValues = elementsOfType.map(e => e.attributes?.id ?? '') ?? []
        return [elementName, stringValues]
    }))

    const unitWeapons = (unit.elements?.find(e => e.name === 'weapons')?.elements ?? [])
        .map(e => {
            const metaAttributes = e.elements?.find(e => e.name === 'meta')?.attributes ?? {}
            const miscAttributes = e.elements?.find(e => e.name === 'misc')?.attributes ?? {}
            const effectElement = e.elements?.find(e => e.name === 'effect')
            const effectAttributes = effectElement?.attributes ?? {}
            const effectBonusAttributes = effectElement?.elements?.find(e => e.name === 'bonus')?.attributes ?? {}

            return {
                name: e.attributes?.id ?? 'Unknown',
                meta: metaAttributes,
                misc: miscAttributes,
                effect: {
                    ...effectAttributes,
                    bonus: effectBonusAttributes
                } as any
            }
        })

    const unitAbilities = (unit.elements?.find(e => e.name === 'abilities')?.elements ?? [])
        .map(e => {
            const commandElement = e.elements?.find(e => e.name === 'command') ?? {} as XmlJsonElement
            const name = commandElement.attributes?.id ?? 'Unknown Ability'
            const metaAttributes = commandElement.elements?.find(e => e.name === 'meta')?.attributes ?? {}
            const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`

            return {
                name,
                iconUrl: iconUrl,
            }
        })

    const unitUpgrades = (unit.elements?.find(e => e.name === 'upgrades')?.elements ?? [])
        .map(e => {
            const upgradeName = e.attributes?.id ?? 'Unknown Upgrade'
            const levelElements = ((e.elements?.filter(e => e.name === 'level') ?? []) as XmlJsonElement[])
                .map(e => {
                    const levelName = e.attributes?.id ?? 'Unknown Upgrade Level'
                    const metaAttributes = e.elements?.find(e => e.name === 'meta')?.attributes ?? {}
                    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
                    const costAttributes = e.elements?.find(e => e.name === 'cost')?.attributes ?? {}

                    return {
                        name: levelName,
                        iconUrl,
                        meta: metaAttributes,
                        cost: costAttributes,
                    }
                })

            return {
                name: upgradeName,
                levels: levelElements
            }
        })

    return (
        <div className="unit-full">
            <div>
                <RaceImg race={race} height={100} />
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
                        <div>{unitCategorizedAttributes.life.start}</div>
                        <div>{unitCategorizedAttributes.armor.start}</div>
                        <div>{unitCategorizedAttributes.shieldArmor.start}</div>
                        <div>Max</div>
                        <div>{unitCategorizedAttributes.life.max}</div>
                        <div>{unitCategorizedAttributes.armor.max}</div>
                        <div>{unitCategorizedAttributes.shieldArmor.max}</div>

                        <div>Regeneration Rate</div>
                        <div>{unitCategorizedAttributes.life.regenRate}</div>
                        <div>{unitCategorizedAttributes.armor.regenRate}</div>
                        <div>{unitCategorizedAttributes.shieldArmor.regenRate}</div>

                        <div>Regeneration Delay</div>
                        <div>{unitCategorizedAttributes.life.delay}</div>
                        <div>{unitCategorizedAttributes.armor.delay}</div>
                        <div>{unitCategorizedAttributes.shieldArmor.delay}</div>
                    </div>
                </div>
                {Boolean(unitCategorizedAttributes.cost) && Object.keys(unitCategorizedAttributes.cost).length > 0
                    && (
                        <div>
                            <h2>Cost</h2>
                            <div className="unit-full__section">
                                <div>Minerals</div>
                                <div>{unitCategorizedAttributes.cost.minerals}</div>
                                <div>Vespene</div>
                                <div>{unitCategorizedAttributes.cost.vespene}</div>
                                <div>Time</div>
                                <div>{unitCategorizedAttributes.cost.time}</div>
                                <div>Supply</div>
                                <div>{unitCategorizedAttributes.cost.supply}</div>
                            </div>
                        </div>
                    )}

                {unitCategorizedQualities.length > 0
                    && (
                        <div>
                            <h2>Attributes</h2>
                            <div className="unit-full__1col">
                                {unitCategorizedQualities.map(attribute =>
                                    <div>{attribute}</div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            <div className="unit-full__movement-misc-score">
                {unitCategorizedAttributes.movement
                    && (<div>
                        <h2>Movement</h2>
                        <div className="unit-full__section">
                            <div>Speed</div>
                            <div>{unitCategorizedAttributes.movement.speed}</div>
                            <div>Acceleration</div>
                            <div>{unitCategorizedAttributes.movement.acceleration}</div>
                            <div>Deceleration</div>
                            <div>{unitCategorizedAttributes.movement.deceleration}</div>
                            <div>Turn Rate</div>
                            <div>{unitCategorizedAttributes.movement.turnRate}</div>
                        </div>
                    </div>)}

                <div>
                    <h2>Miscellaneous</h2>
                    <div className="unit-full__section">
                        <div>Radius</div>
                        <div>{unitCategorizedAttributes.misc.radius}</div>
                        <div>Cargo Size</div>
                        <div>{unitCategorizedAttributes.misc.cargoSize}</div>
                        <div>Foot Print</div>
                        <div>{unitCategorizedAttributes.misc.footprint}</div>
                        <div>Sight Radius</div>
                        <div>{unitCategorizedAttributes.misc.sightRadius}</div>
                        <div>Supply</div>
                        <div>{unitCategorizedAttributes.misc.supply}</div>
                        <div>Speed</div>
                        <div>{unitCategorizedAttributes.misc.speed}</div>
                        <div>Targets</div>
                        <div>{unitCategorizedAttributes.misc.targets}</div>
                    </div>
                </div>

                <div>
                    <h2>Score</h2>
                    <div className="unit-full__section">
                        <div>Build</div>
                        <div>{unitCategorizedAttributes.score.build}</div>
                        <div>Kill</div>
                        <div>{unitCategorizedAttributes.score.kill}</div>
                    </div>
                </div>
            </div>

            <div className="unit-full-50-50">
                <div>
                    <h2>Weapons</h2>
                    <div className="unit-full__list">
                        {unitWeapons.map((unitWeapon, i) => {
                            const weaponIconUrl = `${context.iconsContainerUrl}/${unitWeapon.meta.icon}.png`

                            return <div key={i} className="unit-full__weapon">
                                <img className="unit-full__weapon-img" src={weaponIconUrl} alt={unitWeapon.name} />
                                <div>
                                    <h3>{convertCamelCaseToSpacedCase(unitWeapon.name)}</h3>
                                    <div className="unit-full__weapon-stats">
                                        <div>Range</div><div>{unitWeapon.misc.range}</div>
                                        <div>Speed</div><div>{unitWeapon.misc.speed}</div>
                                        <div>Targets</div><div>{unitWeapon.misc.targets}</div>
                                        <div>Max</div><div>{unitWeapon.effect.max}</div>
                                        <div>Kind</div><div>{unitWeapon.effect.kind}</div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    <h2>Abilities</h2>
                    <div className="unit-full__list">
                        {unitAbilities.map(ability => {
                            return <div key={ability.name} className="unit-full__weapon">
                                <img className="unit-full__weapon-img" src={ability.iconUrl} alt={ability.name} />
                                <div>
                                    <h3>{ability.name}</h3>
                                    {/* <div className="unit-full__weapon-stats">
                                        {ability.attributes.map(([key, value], i) => 
                                            <React.Fragment key={i}>
                                                <div>{key}</div>
                                                <div>{value}</div>
                                            </React.Fragment>
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div>
                    <h2>Upgrades</h2>
                    <div>
                        {unitUpgrades.map((u, i) => {
                            return <div key={i} className="unit-full__upgrade">
                                <h3>{convertCamelCaseToSpacedCase(u.name)}</h3>
                                <div className="unit-full__upgrade-levels">

                                    {u.levels.map((l, j) => (
                                        <div key={j}>
                                            <div>
                                                <IconImage url={l.iconUrl} />
                                            </div>
                                            <div className="unit-full__upgrade-stats">
                                                <img src={`${context.iconsContainerUrl}/Wireframe-General-MineralField.png`} width={30} height={30} alt="Minerals" />
                                                <div>{l.cost.minerals}</div>
                                                <img src={`${context.iconsContainerUrl}/Wireframe-General-VespeneGeyser.png`} width={30} height={30} alt="Vespene" />
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
                        {unitCategorizedStringAttributes.strengths?.map(strength =>
                            <li key={strength}>{convertCamelCaseToSpacedCase(strength)}</li>
                        )}
                    </ul>
                </div>
                <div>
                    <h2>Weaknesses</h2>
                    <ul>
                        {unitCategorizedStringAttributes.weaknesses?.map(strength =>
                            <li key={strength}>{convertCamelCaseToSpacedCase(strength)}</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default UnitFull
