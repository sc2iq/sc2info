import type { LinksFunction, MetaFunction } from "@remix-run/node"
import React from 'react'
import {
  CatchBoundaryComponent,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react"
import resetStyles from '~/styles/reset.css'
import rootStyles from '~/styles/root.css'
import indexStyles from '~/styles/index.css'
import askStyles from '~/styles/ask.css'
import browseStyles from '~/styles/browse.css'
import searchStyles from '~/styles/search.css'
import abilitiesStyles from '~/styles/abilities.css'
import componentAbilityPrviewStyles from '~/components/AbilityPreview.css'

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: resetStyles },
  { rel: 'stylesheet', href: rootStyles },
  { rel: 'stylesheet', href: "https://fonts.googleapis.com/css?family=Roboto&display=swap" },
  { rel: 'stylesheet', href: indexStyles },
  { rel: 'stylesheet', href: askStyles },
  { rel: 'stylesheet', href: browseStyles },
  { rel: 'stylesheet', href: searchStyles },
  { rel: 'stylesheet', href: abilitiesStyles },
  { rel: 'stylesheet', href: componentAbilityPrviewStyles },
])

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "SC2 Info",
  viewport: "width=device-width,initial-scale=1",
  ['theme-color']: "#000000",
})

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch()
  return (
    <AppBase>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <div>
        <NavLink to="/">Return Home</NavLink>
      </div>
    </AppBase>
  )
}

export default function App() {
  return <AppBase>
    <Outlet />
  </AppBase>
}

export const AppBase: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <div className="sc2info__title">
            <NavLink to="/" className="container text-center sc2info__homelink">
              <h1>SC2INFO</h1>
            </NavLink>
            <p>StarCraft 2 Info on units, buildings, weapons, and more.</p>
          </div>
          <nav>
            <div className="container sc2info-navigation">
              <NavLink to="/" className="sc2info-navigation__link">Search</NavLink>
              <NavLink to="/browse" className="sc2info-navigation__link" >Browse</NavLink>
              <NavLink to="/ask" className="sc2info-navigation__link" >Ask</NavLink>
            </div>
          </nav>
        </header>
        <main className="container">
          {children}
        </main>
        <footer>
          <div className="container sc2info-footer">
            SC2INFO - StarCraft 2 Info on units, buildings, weapons, and more.  &nbsp;&nbsp;<a href="https://github.com/sc2iq/sc2info/issues/new" target="_blank">Contact</a>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
