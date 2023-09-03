import React from 'react'
import IconImage from './IconImage'
import { Race, XmlJsonElement } from '~/utilities'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import { getRaceFromString } from '~/helpers'

type Props = {
    upgrade: XmlJsonElement
}

const UnpgradeFull: React.FC<Props> = ({ upgrade }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = upgrade.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const race = getRaceFromString(metaAttributes.icon ?? '') as Race

    const costAttributes = upgrade.elements?.find(e => e.name === 'cost')?.attributes ?? {}
    return (
        <div className="unit-full">
            <div>
                <IconImage url={iconUrl} width={150} height={150} />
            </div>

            <div>
                <h2>Cost</h2>
                <div className="unit-full__section">
                    <div>Minerals</div>
                    <div>{costAttributes.minerals}</div>
                    <div>Vespene</div>
                    <div>{costAttributes.vespene}</div>
                    <div>Time</div>
                    <div>{costAttributes.time}</div>
                </div>
            </div>
        </div>
    )
}

export default UnpgradeFull
