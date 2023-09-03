import React from 'react'
import { XmlJsonElement } from '../utilities'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import Preview from './Preview'

type Props = {
    building: XmlJsonElement
}

const BuildingPreview: React.FC<Props> = ({ building }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = building.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const name = building.attributes?.id ?? ''
    
    return (
        <Preview iconUrl={iconUrl} name={name} />
    )
}

export default BuildingPreview


