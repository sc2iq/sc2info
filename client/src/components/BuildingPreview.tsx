import React from 'react'
import './BuildingPreview.css'
import { convertCamelCaseToSpacedCase } from '../utilities'

type Props = {
    building: any
}

const Component: React.FC<Props> = ({ building }) => {
    return (
        <div className="building-preview">
            <div className="building-preview__picture">
                <img src={building.meta.icon} alt={building.id} width="80" height="80" />
            </div>
            <div className="building-preview__info">
                {convertCamelCaseToSpacedCase(building.meta.name)}
            </div>
        </div>
    )
}

export default Component


