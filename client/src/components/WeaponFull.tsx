import React from 'react'
import RaceImg from './RaceImg'
import './WeaponFull.css'
import IconImage from './IconImage'

type Props = {
    weapon: any
}

const Component: React.FC<Props> = ({ weapon }) => {
    return (
        <div className="unit-full">
            <div>
                <RaceImg race={weapon.meta.race} />
                <IconImage url={weapon.meta.icon} width={150} height={150} />
            </div>

            <div>
                <h2>Miscallaneous</h2>
                <div className="unit-full__section">
                    <div>Range</div>
                    <div>{weapon.misc.range}</div>
                    <div>Speed</div>
                    <div>{weapon.misc.speed}</div>
                    <div>Targets</div>
                    <div>{weapon.misc.targets}</div>
                </div>
            </div>

            <div>
                <h2>Effect</h2>
                <div className="unit-full__section">
                    <div>Radius</div>
                    <div>{weapon.effect.radius}</div>
                    <div>Max</div>
                    <div>{weapon.effect.max}</div>
                    <div>Death</div>
                    <div>{weapon.effect.death}</div>
                    <div>Kind</div>
                    <div>{weapon.effect.kind}</div>
                    {weapon.effect.bonus
                        && <>
                            <div>Bonus Damage</div>
                            <div>{weapon.effect.bonus.damage}</div>
                            <div>Bonus Max</div>
                            <div>{weapon.effect.bonus.max}</div>
                            <div>Bonus Type</div>
                            <div>{weapon.effect.bonus.type}</div>
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Component
