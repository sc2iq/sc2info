import React from 'react'
import './AbilityPreview.css'
import { convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    ability: any
}

const AbilityPreview: React.FC<Props> = ({ ability }) => {
    
    return (
        <>
            {(ability.command as any[]).map((c, i) =>
                {
                    const name = `${convertCamelCaseToSpacedCase(ability.id)} - ${convertCamelCaseToSpacedCase(c.meta.name ?? '')}`
                    return (
                        <div key={i} className="ability-preview">
                        <div className="ability-preview__picture">
                            <IconImage url={c.meta.icon} />
                        </div>
                        <div className="ability-preview__info">
                            {name}
                        </div>
                    </div>
                )}
            )}
        </>
    )
}

export default AbilityPreview


