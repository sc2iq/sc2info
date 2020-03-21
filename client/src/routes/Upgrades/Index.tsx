import React from 'react'
import { Switch, Route, RouteComponentProps } from "react-router-dom"
import Upgrades from './Upgrades'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Upgrades} />
            </Switch>
        </>
    )
}

export default Component 