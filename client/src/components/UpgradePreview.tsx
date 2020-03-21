import React from 'react'
import './UpgradePreview.css'

type Props = {
    upgrade: any
}

const Component: React.FC<Props> = ({ upgrade }) => {
    return (
        <div className="upgrade-preview">
            <div className="upgrade-preview__picture">
                <img src={upgrade.meta.icon} alt={upgrade.id} width="80" height="80" />
            </div>
            <div className="upgrade-preview__info">
                {upgrade.meta.name}
            </div>
        </div>
    )
}

export default Component
