import React from 'react'
import './WeaponPreview.css'
import { convertCamelCaseToSpacedCase } from '../utilities'

type Props = {
    weapon: any
}

const Component: React.FC<Props> = ({ weapon }) => {
    return (
        <div className="weapon-preview">
            <div className="weapon-preview__picture">
                <img src={weapon.meta.icon} alt={weapon.id} width="80" height="80" />
            </div>
            <div className="weapon-preview__info">
                {convertCamelCaseToSpacedCase(weapon.meta.name)}
            </div>
        </div>
    )
}

export default Component

