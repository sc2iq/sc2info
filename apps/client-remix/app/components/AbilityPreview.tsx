import { useOutletContext } from '@remix-run/react'
import React from 'react'
import type { loader as rootLoader } from "~/root"
import type { XmlJsonElement } from '../utilities'
import { convertCamelCaseToSpacedCase } from '../utilities'
import Preview from './Preview'

type Props = {
    ability: XmlJsonElement
    isSelected?: boolean
}

const AbilityPreview: React.FC<Props> = ({ ability, isSelected }) => {
    // const abilityCommandAttributes = ability
    //     .elements?.find(e => e?.name === "command")
    //     ?.attributes ?? {}

    const abilityMetaAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}

    let name = convertCamelCaseToSpacedCase(ability.attributes?.id ?? '')
    // const commandName = convertCamelCaseToSpacedCase(abilityCommandAttributes?.id ?? '')
    // if (typeof commandName === 'string' && commandName.length > 0) {
    //     name += ` - ${commandName}`
    // }

    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const iconUrl = `${context.iconsContainerUrl}/${abilityMetaAttributes?.icon ?? ''}.png`

    return (
        <Preview name={name} iconUrl={iconUrl} isSelected={isSelected} />
    )
}

export default AbilityPreview


