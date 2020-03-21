import React from 'react'
import { NavLink } from "react-router-dom"
import './Browse.css'

const Component: React.FC = () => {
    return (
        <>
            <h1>Browse</h1>

            <section>
                <div className="browse-list">
                    <div>
                        <NavLink to={`/abilities`}>
                            <div><img src="https://sc2iq.blob.core.windows.net/sc2icons/btn-command-attack.png" alt="abilities" /></div>
                            <div>Abilities</div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={`/buildings`}>
                            <div><img src="https://sc2iq.blob.core.windows.net/sc2icons/btn-building-terran-barracks.png" alt="buildings" /></div>
                            <div>Buildings</div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={`/weapons`}>
                            <div><img src="https://sc2iq.blob.core.windows.net/sc2icons/btn-upgrade-terran-infantryweaponslevel0.png" alt="weapons" /></div>
                            <div>Weapons</div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={`/units`}>
                            <div><img src="https://sc2iq.blob.core.windows.net/sc2icons/btn-unit-terran-marine.png" alt="units" /></div>
                            <div>Units</div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={`/upgrades`}>
                            <img src="https://sc2iq.blob.core.windows.net/sc2icons/btn-upgrade-terran-shipweaponslevel1.png" alt="upgrades" />
                            <div>Upgrades</div>
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Component