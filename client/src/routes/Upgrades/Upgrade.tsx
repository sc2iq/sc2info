import React from 'react'
import { NavLink, RouteComponentProps } from "react-router-dom"
import * as urlq from 'urql'
import UpgradeFull from '../../components/UpgradeFull'
import { convertCamelCaseToSpacedCase } from '../../utilities'

const query = `
query upgrade($id: String) {
    upgrade(id: $id) {
      id
      meta {
        name
        icon
        race
        source
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

type MatchParams = {
    upgradeId: string
}

type Props = RouteComponentProps<MatchParams>

const Component: React.FC<Props> = ({ match }) => {

    const [response] = urlq.useQuery({
        query,
        variables: {
            id: match.params.upgradeId
        }
    })

    const upgradeName = convertCamelCaseToSpacedCase(response.data?.upgrade.meta.name ?? '')

    return (
        <>
            <h1>
                <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/upgrades" >Upgrades</NavLink> &gt; {upgradeName}
            </h1>

            <section>
                {response.error
                    && <div>{response.error.name} {response.error.message}</div>}

                {response.data
                    && <UpgradeFull upgrade={response.data.upgrade} />}
            </section>
        </>
    )
}

export default Component