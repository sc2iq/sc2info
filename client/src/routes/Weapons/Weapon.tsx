import React from 'react'
import { NavLink, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import WeaponFull from '../../components/WeaponFull'
import { convertCamelCaseToSpacedCase } from '../../utilities'

const query = `
query weapon($id: Int) {
  weapon(id: $id) {
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
    misc {
      range
      speed
      targets
    }
    effect {
      id
      index
      radius
      max
      death
      kind
      bonus {
        damage
        max
        type
      }
    }
  }
}
  `

type MatchParams = {
    weaponId: string
}

type Props = RouteComponentProps<MatchParams>

const Component: React.FC<Props> = ({ match }) => {

    const [response] = urlq.useQuery({
        query,
        variables: {
            id: match.params.weaponId
        }
    })

    const weaponName = convertCamelCaseToSpacedCase(response.data?.weapon.meta.name ?? '')

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/weapons" >Weapons</NavLink> &gt; {weaponName}
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                {response.data
                    && <WeaponFull weapon={response.data.weapon} />}
            </section>
        </>
    )
}

export default Component