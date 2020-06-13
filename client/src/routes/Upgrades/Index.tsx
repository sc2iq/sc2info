import React from 'react'
import { Switch, Route, RouteComponentProps } from "react-router-dom"
import Upgrades from './Upgrades'
import Upgrade from './Upgrade'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Upgrades} />
                <Route path={`${match.url}/:upgradeId`} component={Upgrade} />
            </Switch>
        </>
    )
}

export default Component 