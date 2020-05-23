import React from 'react'
import { NavLink, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import BuildingFull from '../../components/BuildingFull'

const query = `
query building($id: Int) {
    building(id: $id) {
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
      weaknesses
      weapons
      abilities
      trains
      researches
    }
  }
`

type MatchParams = {
    buildingId: string
}

type Props = RouteComponentProps<MatchParams>

const Component: React.FC<Props> = ({ match }) => {

    const [response] = urlq.useQuery({
        query,
        variables: {
            id: match.params.buildingId
        }
    })

    const buildingName = response.data
        ? response.data.building.meta.name
        : ''

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/buildings" >Buildings</NavLink> &gt; {buildingName}
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                {response.data
                    && <BuildingFull building={response.data.building} />}
            </section>
        </>
    )
}

export default Component