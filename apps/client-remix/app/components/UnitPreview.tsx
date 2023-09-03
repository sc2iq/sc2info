import React from 'react'
import IconImage from './IconImage'
import { convertCamelCaseToSpacedCase } from '../utilities'

type Props = {
    unit: any
}

const UnitPreview: React.FC<Props> = ({ unit }) => {
    return (
        <div className="unit-preview">
            <div className="unit-preview__picture">
                <IconImage url={unit.meta.icon} />
            </div>
            <div className="unit-preview__info">
                {convertCamelCaseToSpacedCase(unit.meta.name)}
            </div>
        </div>
    )
}

export default UnitPreview

