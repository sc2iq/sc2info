import React from 'react'
import './AbilityPreview.css'
import { XmlJsonElement, convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    ability: XmlJsonElement
}

const AbilityPreview: React.FC<Props> = ({ ability }) => {
    console.log({ ability })
    const camelCaseName = ability.attributes?.id ?? ''
    const abilityCommandAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.attributes ?? {}

    const abilityMetaAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}

    let name = convertCamelCaseToSpacedCase(camelCaseName)
    // const commandName = convertCamelCaseToSpacedCase(abilityCommandAttributes?.id ?? '')
    // if (typeof commandName === 'string' && commandName.length > 0) {
    //     name += ` - ${commandName}`
    // }

    const iconUrl = `https://sharedklgoyistorage.blob.core.windows.net/sc2-balancedata-icons/${abilityMetaAttributes?.icon ?? ''}.png`
    
    return (
        <>
            <div className="ability-preview">
                <div className="ability-preview__picture">
                    <IconImage url={iconUrl} />
                </div>
                <div className="ability-preview__info">
                    {name}
                </div>
            </div>
        </>
    )
}

export default AbilityPreview


