import React from 'react'
import './AbilityPreview.css'

type Props = {
    ability: any
}

const Component: React.FC<Props> = ({ ability }) => {
    return (
        <>
            {(ability.command as any[]).map((c, i) =>
                (
                    <div key={i} className="ability-preview">
                        <div className="ability-preview__picture">
                            <img src={c.meta.icon} alt={ability.id} width="80" height="80" />
                        </div>
                        <div className="ability-preview__info">
                            {c.meta.name}
                        </div>
                    </div>
                ))}
        </>
    )
}

export default Component


