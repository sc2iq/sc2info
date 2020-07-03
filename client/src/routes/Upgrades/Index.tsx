import React from 'react'
import { Switch, Route, RouteComponentProps } from "react-router-dom"
import UpgradesRoute from './Upgrades'
import Upgrade from './Upgrade'

type Props = RouteComponentProps
const UnitsIndexRoute: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={UpgradesRoute} />
                <Route path={`${match.url}/:upgradeId`} component={Upgrade} />
            </Switch>
        </>
    )
}

export default UnitsIndexRoute 