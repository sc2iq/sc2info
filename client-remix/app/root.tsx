import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import resetStyles from '~/styles/reset.css'
import rootStyles from '~/styles/root.css'
import indexStyles from '~/styles/index.css'

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: resetStyles },
  { rel: 'stylesheet', href: rootStyles },
  { rel: 'stylesheet', href: indexStyles },
  { rel: 'stylesheet', href: "https://fonts.googleapis.com/css?family=Roboto&display=swap" },
])

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "SC2 Info",
  viewport: "width=device-width,initial-scale=1",
  ['theme-color']: "#000000",
})

export default function App() {
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
          <Outlet />
        </main>
        <footer>
          <div className="container sc2info-footer">
            SC2INFO - StarCraft 2 Info on units, buildings, weapons, and more.  &nbsp;&nbsp;<a href="mailto:sc2info1@gmail.com">Contact</a>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
