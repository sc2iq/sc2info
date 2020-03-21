import React from 'react'
import { Route, Switch, RouteComponentProps } from "react-router-dom"
import Units from './Units'
import Unit from './Unit'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Units} />
                <Route path={`${match.url}/:unitId`} component={Unit} />
            </Switch>
        </>
    )
}

export default Component    