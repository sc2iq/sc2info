import { ActionArgs, LoaderArgs, redirect } from '@remix-run/node'
import { Form, Link, NavLink, useActionData, useLoaderData, useOutletContext } from '@remix-run/react'
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
    console.log('Search', { searchQuery })

    if (searchQuery.length >= minSearchQuery) {
      if (typeof fuseInstance === 'undefined') {
        const jsonFileUrl = process.env.BALANCE_DATA_JSON_URL!
        console.log(`Search: Downloading: ${jsonFileUrl}`)
        const jsonFileResponse = await fetch(jsonFileUrl)
        const balanceData: Record<string, XmlJsonElement[]> = await jsonFileResponse.json()
        console.log(`Search: Complete!`)
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

  console.log({ loaderData })
  const searchQuery = loaderData?.searchQuery ?? ''
  // if (searchQuery.length > 0 && formRef.current) {
  //   console.log(`Set form to ${searchQuery}`)
  //   formRef.current.value = searchQuery
  // }

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

    <h3>Results for: '{}'</h3>
    <section>
      <div className="search-all-list">
        {searchResults.map((searchResult, i) => {

          let path = 'units'
          if (searchResult.item.type === 'ability') {
            path = 'abilities'
          }

          return <Link to={`/${path}/${searchResult.item.name}`} key={i}>
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
