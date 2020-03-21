import React from 'react'
import { NavLink } from "react-router-dom"
import * as urlq from 'urql'
import UpgradePreview from '../../components/UpgradePreview'

const query = `
{
    upgrades {
    id
    meta {
      race
      name
      icon
    }
    ability
    cost {
      minerals
      vespene
      time
      supply
    }
  }
}
`

const Component: React.FC = () => {

    const [response] = urlq.useQuery({
        query,
    })

    const upgrades = response.data
        ? (response.data.upgrades as any[])
        : []

    const groups = {
        terran: upgrades.filter(u => u.meta.icon.toLowerCase().includes("terran")).sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
        zerg: upgrades.filter(u => u.meta.icon.toLowerCase().includes("zerg")).sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
        protoss: upgrades.filter(u => u.meta.icon.toLowerCase().includes("protoss")).sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
    }

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> > Upgrades
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}


                <div className="race-lists">
                    <div>
                        <h2>Terran</h2>
                        <div className="building-preview-list">
                            {groups.terran.map((upgrade, i) =>
                                <UpgradePreview key={i} upgrade={upgrade} />
                            )}
                        </div>
                    </div>

                    <div>
                        <h2>Zerg</h2>
                        <div className="building-preview-list">
                            {groups.zerg.map((upgrade, i) =>
                                <UpgradePreview key={i} upgrade={upgrade} />
                            )}
                        </div>
                    </div>

                    <div>
                        <h2>Protoss</h2>
                        <div className="building-preview-list">
                            {groups.protoss.map((upgrade, i) =>
                                <UpgradePreview key={i} upgrade={upgrade} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Component 