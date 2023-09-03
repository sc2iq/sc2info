import React from 'react'
import { convertCamelCaseToSpacedCase } from '../utilities'
import IconImage from './IconImage'

type Props = {
    upgrade: any
}

const UnitPreview: React.FC<Props> = ({ upgrade }) => {
    return (
        <div className="upgrade-preview">
            <div className="upgrade-preview__picture">
                <IconImage url={upgrade.meta.icon} />
            </div>
            <div className="upgrade-preview__info">
                {convertCamelCaseToSpacedCase(upgrade.meta.name)}
            </div>
        </div>
    )
}

export default UnitPreview
