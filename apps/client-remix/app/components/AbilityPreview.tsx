import React from 'react'
import { XmlJsonElement, convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'
import Preview from './Preview'

type Props = {
    ability: XmlJsonElement
    isSelected?: boolean
}

const AbilityPreview: React.FC<Props> = ({ ability, isSelected }) => {
    const abilityCommandAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.attributes ?? {}

    const abilityMetaAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}

    let name = convertCamelCaseToSpacedCase(ability.attributes?.id ?? '')
    // const commandName = convertCamelCaseToSpacedCase(abilityCommandAttributes?.id ?? '')
    // if (typeof commandName === 'string' && commandName.length > 0) {
    //     name += ` - ${commandName}`
    // }

    const iconUrl = `https://sharedklgoyistorage.blob.core.windows.net/sc2-balancedata-icons/${abilityMetaAttributes?.icon ?? ''}.png`

    return (
        <Preview name={name} iconUrl={iconUrl} isSelected={isSelected} />
    )
}

export default AbilityPreview


