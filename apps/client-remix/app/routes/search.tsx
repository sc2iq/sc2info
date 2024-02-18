import { LoaderArgs } from '@remix-run/node'
import { Form, Link, NavLink, useLoaderData, useLocation } from '@remix-run/react'
import React from 'react'
import SearchResult from '~/components/SearchResult'
import { IGenericSearchItem, getFuseObject } from '~/helpers/search'
import Fuse from 'fuse.js'
import { XmlJsonElement } from '~/utilities'

let fuseInstance: Fuse<IGenericSearchItem> | undefined = undefined

const minSearchQuery = 3

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)

  if (url.searchParams.get('intent') === 'search') {
    const searchQuery = url.searchParams.get('query') ?? ''
    if (searchQuery.length >= minSearchQuery) {
      if (typeof fuseInstance === 'undefined') {
        console.group('Search')
        const jsonFileUrl = process.env.BALANCE_DATA_JSON_URL!
        console.log(`Downloading: ${jsonFileUrl}`)
        const jsonFileResponse = await fetch(jsonFileUrl)
        const balanceData: Record<string, XmlJsonElement[]> = await jsonFileResponse.json()
        console.log(`Complete!`)
        console.groupEnd()
        fuseInstance = getFuseObject(balanceData)
        console.log(`fuseIntance type: `, typeof fuseInstance)
      }

      const searchResults = fuseInstance.search(searchQuery)

      return {
        searchQuery,
        searchResults,
      }
    }
  }

  return null
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const formRef = React.useRef<HTMLFormElement>(null)

  const onSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      formRef.current?.reset()
    }
  }

  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const query = searchParams.get('query') ?? ''
  const searchResults = loaderData?.searchResults ?? []

  return <>
    <div className="search-header">
      <Form method='GET' className="search-input" ref={formRef}>
        <div className="search-input__icon">
        </div>
        <input
          className="search-input__control"
          placeholder="Search... zergling, hatchery, or guass rifle. (Must be at least 3 characters)"
          spellCheck={false}
          autoComplete="off"
          name='query'
          onKeyUp={onSearchKeyUp}
        />
        <input type="hidden" name="intent" value="search" />
        <button type="reset" className="search-input__close">
          &times;
        </button>
      </Form>
    </div>

    <h3>Results for: '{query}'</h3>
    <section>
      <div className="search-all-list">
        {searchResults.map((searchResult, i) => {

          let toUrl = `/units/${searchResult.item.name}`
          if (searchResult.item.type === 'ability') {
            let name = searchResult.item.name.replace(/\s/g, '').replace('%20', '').toLowerCase()

            toUrl = `/abilities#${name}`
          }
          else if (searchResult.item.type === 'building') {
            toUrl = `/buildings/${searchResult.item.name}`
          }
          else if (searchResult.item.type === 'weapon') {
            toUrl = `/weapons/${searchResult.item.name}`
          }
          else if (searchResult.item.type === 'upgrade') {
            toUrl = `/upgrades/${searchResult.item.name}`
          }

          return <Link to={toUrl} key={i}>
            <SearchResult searchAllResult={searchResult} />
          </Link>
        })}
      </div>
    </section>
    <section className="search-footer">
      <p>Still can't find the item using search? Try <NavLink to={`/browse`}>Browsing</NavLink> through categories or <NavLink to={`/ask`}>Asking</NavLink> a question.</p>

      <ul>
        <li><NavLink to={`/units`}>Units</NavLink></li>
        <li><NavLink to={`/abilities`}>Abilities</NavLink></li>
        <li><NavLink to={`/buildings`}>Buildings</NavLink></li>
        <li><NavLink to={`/upgrades`}>Upgrades</NavLink></li>
        <li><NavLink to={`/weapons`}>Weapons</NavLink></li>
      </ul>
    </section>
  </>
}
