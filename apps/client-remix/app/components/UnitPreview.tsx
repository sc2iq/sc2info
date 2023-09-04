import React from 'react'
import { XmlJsonElement } from '../utilities'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import Preview from './Preview'

type Props = {
    unit: XmlJsonElement
}

const UnitPreview: React.FC<Props> = ({ unit }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = unit.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const name = unit.attributes?.id ?? ''
    
    return (
        <Preview iconUrl={iconUrl} name={name} />
    )
}

export default UnitPreview


