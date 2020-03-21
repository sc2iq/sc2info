import React from 'react'
import { Switch, Route, RouteComponentProps } from "react-router-dom"
import Buildings from './Buildings'
import Building from './Building'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Buildings} />
                <Route path={`${match.url}/:buildingId`} component={Building} />
            </Switch>
        </>
    )
}

export default Component 