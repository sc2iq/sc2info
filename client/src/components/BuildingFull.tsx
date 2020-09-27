import React from 'react'
import RaceImg from './RaceImg'
import './BuildingFull.css'
import IconImage from './IconImage'

type Props = {
    building: any
}

const BuildingFull: React.FC<Props> = ({ building }) => {

    return (
        <div className="building-full">
            <div>
                <RaceImg race={building.meta.race} />
                <IconImage url={building.meta.icon} width={150} height={150} />
            </div>

            <div className="unit-full__lift-cost">
                <div>
                    <h2>Life</h2>
                    <div className="unit-full__life">
                        <b></b>
                        <div>Life</div>
                        <div>Armor</div>
                        <div>SheildArmor</div>
                        <div>Start</div>
                        <div>{building.life.start}</div>
                        <div>{building.armor.start}</div>
                        <div>{building.shieldArmor.start}</div>
                        <div>Max</div>
                        <div>{building.life.max}</div>
                        <div>{building.armor.max}</div>
                        <div>{building.shieldArmor.max}</div>

                        <div>Regeneration Rate</div>
                        <div>{building.life.regenRate}</div>
                        <div>{building.armor.regenRate}</div>
                        <div>{building.shieldArmor.regenRate}</div>

                        <div>Regeneration Delay</div>
                        <div>{building.life.delay}</div>
                        <div>{building.armor.delay}</div>
                        <div>{building.shieldArmor.delay}</div>
                    </div>
                </div>

                {building.cost
                    && (
                        <div>
                            <h2>Cost</h2>
                            <div className="unit-full__section">
                                <div>Minerals</div>
                                <div>{building.cost.minerals}</div>
                                <div>Vespene</div>
                                <div>{building.cost.vespene}</div>
                                <div>Time</div>
                                <div>{building.cost.time}</div>
                            </div>
                        </div>
                    )}

                {building.attributes
                    && (
                        <div>
                            <h2>Attributes</h2>
                            <div className="unit-full__1col">
                                {(building.attributes as string[]).map((a, i) =>
                                    <div key={i}>{a}</div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default BuildingFull
