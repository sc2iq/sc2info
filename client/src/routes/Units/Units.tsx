import React from 'react'
import { NavLink, Link, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import UnitPreview from '../../components/UnitPreview'

const query = `
query ($first: Int, $after: String ) {
    units(depth: 1, first: $first, after: $after) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          meta {
            name
            icon
            race
          }
        }
        cursor
      }
    }
  }
`

type Props = RouteComponentProps
const UnitsRoute: React.FC<Props> = ({ match }) => {

    const [response] = urlq.useQuery({
        query,
        variables: {
            first: 100,
            after: ''
        }
    })

    const unitsObject = response.data?.units
    const units: any[] = unitsObject?.edges ?? []

    const groups = {
        terran: units.map(u => u.node)
            .filter(u => u.meta.race === "terran")
            .filter(u => {
                const remove = [/alternate/i, /nova/i, /preview/i, /sieged/, /AP/, /AA/, /missile/i].some(regex => regex.test(u.meta.name))
                return !remove
            })
            .sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
        zerg: units.map(u => u.node)
            .filter(u => u.meta.race === "zerg")
            .filter(u => {
                const remove = [/burrowed/i, /escort/i, /placement/i, /cocoon/i, /missile/i, /changeling[zm]/i, /Siege/i,].some(regex => regex.test(u.meta.name))
                return !remove
            })
            .sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
        protoss: units.map(u => u.node)
            .filter(u => u.meta.race === "protoss")
            .filter(u => {
                const remove = [/preview/i, /Siege/i,].some(regex => regex.test(u.meta.name))
                return !remove
            })
            .sort((a, b) => (a.meta.name as string).localeCompare(b.meta.name)),
    }

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; Units
            </h1>
            <p>Total Count: {unitsObject && unitsObject.totalCount}</p>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                <div className="race-lists">
                    <div>
                        <h2>Terran</h2>
                        <div className="building-preview-list">
                            {groups.terran.map((unit, i) => {
                                return (
                                    <Link to={`${match.url}/${unit.id}`} key={unit.id}>
                                        <UnitPreview unit={unit} />
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </div>

                    <div>
                        <h2>Zerg</h2>
                        <div className="building-preview-list">
                            {groups.zerg.map((unit, i) => {
                                return (
                                    <Link to={`${match.url}/${unit.id}`} key={unit.id}>
                                        <UnitPreview unit={unit} />
                                    </Link>
                                )
                            })
                            }
                        </div>
                    </div>

                    <div>
                        <h2>Protoss</h2>
                        <div className="building-preview-list">
                            {groups.protoss.map((unit, i) => {
                                return (
                                    <Link to={`${match.url}/${unit.id}`} key={unit.id}>
                                        <UnitPreview unit={unit} />
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

export default UnitsRoute 