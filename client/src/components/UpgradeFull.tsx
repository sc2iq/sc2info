import React from 'react'
import './UpgradeFull.css'
import IconImage from './IconImage'

type Props = {
    upgrade: any
}

const Component: React.FC<Props> = ({ upgrade }) => {
    return (
        <div className="unit-full">
            <div>
                <IconImage url={upgrade.meta.icon} width={150} height={150} />
            </div>

            <div>
                <h2>Cost</h2>
                <div className="unit-full__section">
                    <div>Minerals</div>
                    <div>{upgrade.cost.minerals}</div>
                    <div>Vespene</div>
                    <div>{upgrade.cost.vespene}</div>
                    <div>Time</div>
                    <div>{upgrade.cost.time}</div>
                    <div>Supply</div>
                    <div>{upgrade.cost.supply}</div>
                </div>
            </div>
        </div>
    )
}

export default Component
