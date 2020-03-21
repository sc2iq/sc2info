import React from 'react'
import { Route, Switch, RouteComponentProps } from "react-router-dom"
import Weapons from './Weapons'
import Weapon from './Weapon'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Weapons} />
                <Route path={`${match.url}/:weaponId`} component={Weapon} />
            </Switch>
        </>
    )
}

export default Component