import React from 'react'
import { Route, Switch, RouteComponentProps } from "react-router-dom"
import UnitsRoute from './Units'
import Unit from './Unit'

type Props = RouteComponentProps
const UnitIndexRoute: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={UnitsRoute} />
                <Route path={`${match.url}/:unitId`} component={Unit} />
            </Switch>
        </>
    )
}

export default UnitIndexRoute