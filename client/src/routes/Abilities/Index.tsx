import React from 'react'
import { Switch, Route, RouteComponentProps } from "react-router-dom"
import Abilities from './Abilities'

type Props = RouteComponentProps
const Component: React.FC<Props> = ({ match }) => {
    return (
        <>
            <Switch>
                <Route exact path={`${match.url}`} component={Abilities} />
            </Switch>
        </>
    )
}

export default Component 