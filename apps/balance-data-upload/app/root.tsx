import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  V2_MetaFunction,
} from "@remix-run/react"

import stylesheet from "~/styles/tailwing.css"

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : []),
  { rel: "stylesheet", href: stylesheet },
]

export const meta: V2_MetaFunction = () => {
  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { title: "SC2 Balance Data Upload" },
    { name: "description", content: "Export Balance Data Files from SC2Editor" },
  ]
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="min-h-full bg-slate-800 text-slate-200 flex justify-center items-center">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
