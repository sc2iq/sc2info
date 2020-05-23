import React from 'react'
import { NavLink, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import UnitFull from '../../components/UnitFull'

const query = `
  query unit($id: Int) {
    unit(id: $id) {
        id
        original {
            strengths {
              id
              name
            }
            weaknesses {
              id
              name
            }
            weapons {
              meta {
                name
                icon
              }
              misc {
                range
                speed
                targets
              }
              effect {
                max
                death
                radius
                bonus {
                  damage
                  max
                  type
                }
              }
            }
            upgrades {
              id
              name
              levels {
                id
                index
                meta {
                  index
                  name
                  icon
                }
                cost {
                  minerals
                  vespene
                  time
                }
            } 
          }
        }
        meta {
            name
            icon
            race
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
    }
}
  `

type MatchParams = {
    unitId: string
}

type Props = RouteComponentProps<MatchParams>

const Component: React.FC<Props> = ({ match }) => {
    const [response] = urlq.useQuery({
        query,
        variables: {
            id: match.params.unitId
        }
    })

    const unitName = response.data
        ? response.data.unit && response.data.unit.meta && response.data.unit.meta.name
        : ''

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/units" >Units</NavLink> &gt; {unitName}
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                {response.data && response.data.unit
                    && <UnitFull unit={response.data.unit} />}
            </section>
        </>
    )
}

export default Component  