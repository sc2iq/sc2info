import { type LinksFunction, type LoaderArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import React from 'react'

import type {
  ShouldRevalidateFunction,
  V2_MetaFunction
} from "@remix-run/react"
import componentFuseMatchStyles from '~/components/FuseMatch.css'
import componentPreviewStyles from '~/components/Preview.css'
import componentSearchResultStyles from '~/components/SearchResult.css'
import componentUnitFullStyles from '~/components/UnitFull.css'
import componentUpgradeFullStyles from '~/components/UpgradeFull.css'
import componentWeaponFullStyles from '~/components/WeaponFull.css'
import abilitiesStyles from '~/styles/abilities.css'
import askStyles from '~/styles/ask.css'
import browseStyles from '~/styles/browse.css'
import indexStyles from '~/styles/index.css'
import resetStyles from '~/styles/reset.css'
import rootStyles from '~/styles/root.css'
import searchStyles from '~/styles/search.css'
import type { XmlJsonElement } from "./utilities"

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: resetStyles },
  { rel: 'stylesheet', href: rootStyles },
  { rel: 'stylesheet', href: "https://fonts.googleapis.com/css?family=Roboto&display=swap" },
  { rel: 'stylesheet', href: indexStyles },
  { rel: 'stylesheet', href: askStyles },
  { rel: 'stylesheet', href: browseStyles },
  { rel: 'stylesheet', href: searchStyles },
  { rel: 'stylesheet', href: abilitiesStyles },
  { rel: 'stylesheet', href: componentPreviewStyles },
  { rel: 'stylesheet', href: componentFuseMatchStyles },
  { rel: 'stylesheet', href: componentSearchResultStyles },
  { rel: 'stylesheet', href: componentUnitFullStyles },
  { rel: 'stylesheet', href: componentUpgradeFullStyles },
  { rel: 'stylesheet', href: componentWeaponFullStyles },
])

export const meta: V2_MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { viewport: "width=device-width,initial-scale=1" },
    { title: "SC2 Info" },
    { name: "description", content: "StarCraft 2 Information about Units, Buildings, Weapons, and More!" },
  ]
}

export function ErrorBoundary() {
  const error = useRouteError()

  console.error(error)

  if (isRouteErrorResponse(error)) {
    return (
      <AppBase>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
        <div>
          <NavLink to="/">Return Home</NavLink>
        </div>
      </AppBase>
    )
  } else if (error instanceof Error) {
    return (
      <AppBase>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
        <div>
          <NavLink to="/">Return Home</NavLink>
        </div>
      </AppBase>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}

let balanceData: Record<string, XmlJsonElement[]> | undefined = undefined

export const loader = async (args: LoaderArgs) => {
  if (typeof balanceData === 'undefined') {
    const jsonFileUrl = process.env.BALANCE_DATA_JSON_URL!
    console.log(`Downloading: ${jsonFileUrl}`)
    const jsonFileResponse = await fetch(jsonFileUrl)
    balanceData = await jsonFileResponse.json()
    console.log(`Complete!`)
    console.groupEnd()
  }

  const iconsContainerUrl = process.env.ICONS_CONTAINER_URL

  return {
    iconsContainerUrl,
    balanceData,
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>()

  return <AppBase>
    <Outlet context={loaderData} />
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
              <NavLink to="/search" className="sc2info-navigation__link">Search</NavLink>
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
            SC2INFO - StarCraft 2 Info on units, buildings, weapons, and more.  &nbsp;&nbsp;<a href="https://github.com/sc2iq/sc2info/issues/new" target="_blank" rel="noreferrer">Contact</a>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
