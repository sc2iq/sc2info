import React from 'react'
import './WeaponPreview.css'
import { convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    weapon: any
}

const Component: React.FC<Props> = ({ weapon }) => {
    return (
        <div className="weapon-preview">
            <div className="weapon-preview__picture">
                <IconImage url={weapon.meta.icon} />
            </div>
            <div className="weapon-preview__info">
                {convertCamelCaseToSpacedCase(weapon.meta.name)}
            </div>
        </div>
    )
}

export default Component

