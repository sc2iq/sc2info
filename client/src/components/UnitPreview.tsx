import React from 'react'
import './UnitPreview.css'

type Props = {
    unit: any
}

const Component: React.FC<Props> = ({ unit }) => {
    return (
        <div className="unit-preview">
            <div className="unit-preview__picture">
                <img src={unit.meta.icon} alt={unit.id} width="80" height="80" />
            </div>
            <div className="unit-preview__info">
                {unit.meta.name}
            </div>
        </div>
    )
}

export default Component

