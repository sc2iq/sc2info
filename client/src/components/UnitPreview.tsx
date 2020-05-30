import React from 'react'
import './UnitPreview.css'
import IconImage from './IconImage'

type Props = {
    unit: any
}

const Component: React.FC<Props> = ({ unit }) => {
    return (
        <div className="unit-preview">
            <div className="unit-preview__picture">
                <IconImage url={unit.meta.icon} />
            </div>
            <div className="unit-preview__info">
                {unit.meta.name}
            </div>
        </div>
    )
}

export default Component

