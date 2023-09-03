import React from 'react'
import RaceImg from './RaceImg'
import IconImage from './IconImage'
import { Race, XmlJsonElement } from '~/utilities'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import { getRaceFromString } from '~/helpers'

type Props = {
    building: XmlJsonElement
}

const BuildingFull: React.FC<Props> = ({ building }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = building.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`

    const lifeAttributes = building.elements?.find(e => e.name === 'life')?.attributes ?? {}
    const armorAttributes = building.elements?.find(e => e.name === 'armor')?.attributes ?? {}
    const shieldArmorAttributes = building.elements?.find(e => e.name === 'shieldArmor')?.attributes ?? {}
    const costAttributes = building.elements?.find(e => e.name === 'cost')?.attributes ?? {}
    const attributesElements = building.elements?.find(e => e.name === 'attributes')?.elements ?? []
    const buildingAttributes = attributesElements.map(e => e.attributes?.type ?? '')

    return (
        <div className="building-full">
            <div>
                <RaceImg race={getRaceFromString(metaAttributes.icon ?? '') as Race} width={50} height={90} />
                <IconImage url={iconUrl} width={150} height={100} />
            </div>

            <div className="unit-full__lift-cost">
                <div>
                    <h2>Life</h2>
                    <div className="unit-full__life">
                        <b></b>
                        <div>Life</div>
                        <div>Armor</div>
                        <div>SheildArmor</div>
                        <div>Start</div>
                        <div>{lifeAttributes?.start}</div>
                        <div>{armorAttributes?.start}</div>
                        <div>{shieldArmorAttributes?.start}</div>
                        <div>Max</div>
                        <div>{lifeAttributes?.max}</div>
                        <div>{armorAttributes?.max}</div>
                        <div>{shieldArmorAttributes?.max}</div>

                        <div>Regeneration Rate</div>
                        <div>{lifeAttributes?.regenRate}</div>
                        <div>{armorAttributes?.regenRate}</div>
                        <div>{shieldArmorAttributes?.regenRate}</div>

                        <div>Regeneration Delay</div>
                        <div>{lifeAttributes?.delay}</div>
                        <div>{armorAttributes?.delay}</div>
                        <div>{shieldArmorAttributes?.delay}</div>
                    </div>
                </div>

                {costAttributes
                    && (
                        <div>
                            <h2>Cost</h2>
                            <div className="unit-full__section">
                                <div>Minerals</div>
                                <div>{costAttributes?.minerals}</div>
                                <div>Vespene</div>
                                <div>{costAttributes?.vespene}</div>
                                <div>Time</div>
                                <div>{costAttributes?.time}</div>
                            </div>
                        </div>
                    )}

                {buildingAttributes.length > 0
                    && (
                        <div>
                            <h2>Attributes</h2>
                            <div className="unit-full__1col">
                                {buildingAttributes.map((a, i) =>
                                    <div key={i}>{a}</div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default BuildingFull
