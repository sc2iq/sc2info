import React from 'react'
import RaceImg from './RaceImg'
import IconImage from './IconImage'
import { Race, XmlJsonElement } from '~/utilities'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import { getRaceFromString } from '~/helpers'

type Props = {
    weapon: XmlJsonElement
}

const WeaponFull: React.FC<Props> = ({ weapon }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = weapon.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const race = getRaceFromString(metaAttributes.icon ?? '') as Race

    const miscAttributes = weapon.elements?.find(e => e.name === 'misc')?.attributes ?? {}
    const effectElement = weapon.elements?.find(e => e.name === 'effect') ?? {} as XmlJsonElement
    const effectBonusAttributes = effectElement.elements?.find(e => e.name === 'bonus')?.attributes ?? {}

    return (
        <div className="unit-full">
            <div>
                <RaceImg race={race} width={50} height={75} />
                <IconImage url={iconUrl} />
            </div>

            <div>
                <h2>Miscellaneous</h2>
                <div className="unit-full__section">
                    <div>Range</div>
                    <div>{miscAttributes.range}</div>
                    <div>Speed</div>
                    <div>{miscAttributes.speed}</div>
                    <div>Targets</div>
                    <div>{miscAttributes.targets}</div>
                </div>
            </div>

            <div>
                <h2>Effect</h2>
                <div className="unit-full__section">
                    <div>Radius</div>
                    <div>{effectElement.attributes?.radius}</div>
                    <div>Max</div>
                    <div>{effectElement.attributes?.max}</div>
                    <div>Death</div>
                    <div>{effectElement.attributes?.death}</div>
                    <div>Kind</div>
                    <div>{effectElement.attributes?.kind}</div>
                    {Object.keys(effectBonusAttributes).length > 0
                        && <>
                            <div>Bonus Damage</div>
                            <div>{effectBonusAttributes.damage}</div>
                            <div>Bonus Max</div>
                            <div>{effectBonusAttributes.max}</div>
                            <div>Bonus Type</div>
                            <div>{effectBonusAttributes.type}</div>
                        </>}
                </div>
            </div>
        </div>
    )
}

export default WeaponFull
