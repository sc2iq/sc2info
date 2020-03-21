import React from 'react'
import { NavLink, Link, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import BuildingPreview from '../../components/BuildingPreview'

const query = `
{
    buildings {
      id
      index
      meta {
        name
        icon
        race
        hotkey
        source
        index
        tooltip
      }
      life {
        start
        max
        regenRate
        delay
      }
      armor {
        start
        max
        regenRate
        delay
      }
      shieldArmor {
        start
        max
        regenRate
        delay
      }
      requires
      cost {
        minerals
        vespene
        time
        supply
      }
      movement {
        speed
        acceleration
        deceleration
        turnRate
      }
      score {
        build
        kill
      }
      misc {
        radius
        cargoSize
        footprint
        sightRadius
        supply
        speed
        targets
      }
      producer
      attributes
      strengths
      weaknesses
      weapons
      abilities
      trains
      researches
    }
  }
`

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {

  const [response] = urlq.useQuery({
    query,
  })

  const buildings = response.data
    ? (response.data.buildings as any[])
    : []

  const groupedBuildings = {
    terran: buildings.filter(x => x).filter(b => b.meta.race === "terran").sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
    zerg: buildings.filter(x => x).filter(b => b.meta.race === "zerg"),
    protoss: buildings.filter(x => x).filter(b => b.meta.race === "protoss"),
  }

  return (
    <>
      <h1>
        <NavLink to="/browse" >Browse</NavLink> > Buildings
      </h1>

      <section>
        {response.error
          && <div>{response.error.name} {response.error.message}</div>}


        <div className="race-lists">
          <div>
            <h2>Terran</h2>
            <div className="building-preview-list">
              {groupedBuildings.terran.map((building, i) => {
                return (
                  <Link key={i} to={`${match.url}/${building.id}`}>
                    <BuildingPreview building={building} />
                  </Link>
                )
              })
              }
            </div>
          </div>

          <div>
            <h2>Zerg</h2>
            <div className="building-preview-list">
              {groupedBuildings.zerg.map((building, i) => {
                return (
                  <Link key={i} to={`${match.url}/${building.id}`}>
                    <BuildingPreview building={building} />
                  </Link>
                )
              })
              }
            </div>
          </div>
          
          <div>
            <h2>Protoss</h2>
            <div className="building-preview-list">
              {groupedBuildings.protoss.map((building, i) => {
                return (
                  <Link key={i} to={`${match.url}/${building.id}`}>
                    <BuildingPreview building={building} />
                  </Link>
                )
              })
              }
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Component 