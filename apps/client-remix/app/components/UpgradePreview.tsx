import React from 'react'
import { XmlJsonElement, convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'
import { loader as rootLoader } from "~/root"
import { useOutletContext } from '@remix-run/react'
import Preview from './Preview'

type Props = {
    upgrade: XmlJsonElement
}

const UnitPreview: React.FC<Props> = ({ upgrade }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const metaAttributes = upgrade.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const iconUrl = `${context.iconsContainerUrl}/${metaAttributes.icon}.png`
    const name = upgrade.attributes?.id ?? ''
    return (
        <Preview iconUrl={iconUrl} name={name} />
    )
}

export default UnitPreview
