import React from 'react'
import { NavLink, Link, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import WeaponPreview from '../../components/WeaponPreview'

const query = `
{
  weapons {
    id
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
      kind
      radius
      max
      death
      bonus {
        damage
        max
        type
      }
    }
  }
}
`

type Props = RouteComponentProps
const Weapons: React.FC<Props> = ({ match }) => {
  const [response] = urlq.useQuery({
    query,
  })

  const weapons: any[] = response.data?.weapons ?? []

  const groups = {
    terran: weapons.filter(w => w.meta.race === "terran").sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
    zerg: weapons.filter(w => w.meta.race === "zerg").sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
    protoss: weapons.filter(w => w.meta.race === "protoss").sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
  }

  return (
    <>
      <h1>
        <NavLink to="/browse" >Browse</NavLink> &gt; Weapons
            </h1>

      <section>
        {response.error
          && <div>{response.error.name} {response.error.message}</div>}

        <div className="race-lists">
          <div>
            <h2>Terran</h2>
            <div className="building-preview-list">
              {groups.terran.map((weapon, i) => {
                return (
                  <Link to={`${match.url}/${weapon.id}`} key={i}>
                    <WeaponPreview weapon={weapon} />
                  </Link>
                )
              })
              }
            </div>
          </div>

          <div>
            <h2>Zerg</h2>
            <div className="building-preview-list">
              {groups.zerg.map((weapon, i) => {
                return (
                  <Link to={`${match.url}/${weapon.id}`} key={i}>
                    <WeaponPreview weapon={weapon} />
                  </Link>
                )
              })
              }
            </div>
          </div>

          <div>
            <h2>Protoss</h2>
            <div className="building-preview-list">
              {groups.protoss.map((weapon, i) => {
                return (
                  <Link to={`${match.url}/${weapon.id}`} key={i}>
                    <WeaponPreview weapon={weapon} />
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

export default Weapons 