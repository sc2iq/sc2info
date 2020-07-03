import React from 'react'
import './BuildingPreview.css'
import { convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    building: any
}

const BuildingPreview: React.FC<Props> = ({ building }) => {
    return (
        <div className="building-preview">
            <div className="building-preview__picture">
                <IconImage url={building.meta.icon} />
            </div>
            <div className="building-preview__info">
                {convertCamelCaseToSpacedCase(building.meta.name)}
            </div>
        </div>
    )
}

export default BuildingPreview


