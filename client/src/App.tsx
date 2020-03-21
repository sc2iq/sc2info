import React from 'react'
import { Route, Switch, NavLink, Redirect } from "react-router-dom"
import Search from './routes/Search'
import Browse from './routes/Browse'

import Abilities from './routes/Abilities/Index'
import Buildings from './routes/Buildings/Index'
import Units from './routes/Units/Index'
import Upgrades from './routes/Upgrades/Index'
import Weapons from './routes/Weapons/Index'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="sc2info">
      <header>
        <NavLink to="/" className="container text-center sc2info__homelink">
          <h1>SC2INFO</h1>
          <p>StarCraft 2 Info on units, buildings, weapons, and more.</p>
        </NavLink>
      </header>

      <nav>
        <div className="container sc2info-navigation">
          <NavLink to="/" exact className="sc2info-navigation__link">Search</NavLink>
          <NavLink to="/browse" className="sc2info-navigation__link" >Browse</NavLink>
        </div>
      </nav>

      <main className="container">
        <Switch>
          <Route path="/" exact component={Search} />
          <Route path="/browse" exact component={Browse} />

          <Route path="/abilities" component={Abilities} />
          <Route path="/buildings" component={Buildings} />
          <Route path="/units" component={Units} />
          <Route path="/upgrades" component={Upgrades} />
          <Route path="/weapons" component={Weapons} />
          <Route render={({ match }) => {
            console.log(`Redirect: `, { location: window.location, match })
            // return <Redirect to="/" />
            return <div>404 - No match. {match.url} <NavLink to="/">Home</NavLink></div>
          }}></Route>
        </Switch>
      </main>

      <footer>
        <div className="container sc2info-footer">
          SC2INFO - StarCraft 2 Info on units, buildings, weapons, and more.  &nbsp;&nbsp;<a href="mailto:sc2info1@gmail.com">Contact</a>
        </div>
      </footer>
    </div>
  )
}

export default App
