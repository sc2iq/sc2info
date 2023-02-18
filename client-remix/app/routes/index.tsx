import { LinksFunction } from '@remix-run/node'
import indexStyles from '~/styles/index.css'

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: indexStyles },
])

export default function Index() {
  return <>
    <h1>Index Title</h1>
  </>
}
