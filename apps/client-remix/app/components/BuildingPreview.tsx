import React, { useContext } from 'react'
import { XmlJsonElement, convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'

type Props = {
    building: XmlJsonElement
}

const BuildingPreview: React.FC<Props> = ({ building }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = building.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    return (
        <div className="building-preview">
            <div className="building-preview__picture">
                <IconImage url={iconUrl} />
            </div>
            <div className="building-preview__info">
                {convertCamelCaseToSpacedCase(metaAttributes.name)}
            </div>
        </div>
    )
}

export default BuildingPreview


