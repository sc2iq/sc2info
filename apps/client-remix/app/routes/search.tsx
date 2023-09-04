import { ActionArgs } from '@remix-run/node'
import { Form, Link, NavLink, useActionData, useOutletContext } from '@remix-run/react'
import React from 'react'
import SearchResult from '~/components/SearchResult'
import { IGenericSearchItem, getFuseObject } from '~/helpers/search'
import Fuse from 'fuse.js'
import { XmlJsonElement } from '~/utilities'

let fuseInstance: Fuse<IGenericSearchItem> | undefined = undefined

const minSearchQuery = 3

export const action = async ({ request }: ActionArgs) => {
  const rawFormData = await request.formData()
  const formData = Object.fromEntries(rawFormData.entries())

  if (formData.intent === 'search') {
    console.log('Search', { formData })
    const searchQuery = formData.searchQuery as string
    if (searchQuery.length >= minSearchQuery) {
      console.log({ searchQuery })

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
  const context = useOutletContext()
  const actionData = useActionData<typeof action>()
  const formRef = React.useRef<HTMLFormElement>(null)

  const onSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      formRef.current?.reset()
    }
  }

  console.log({ actionData })
  const searchResults = actionData?.searchResults ?? []

  return <>
    <div className="search-header">
      <Form method='POST' className="search-input" ref={formRef}>
        <div className="search-input__icon">
        </div>
        <input
          className="search-input__control"
          placeholder="Search... zergling, hatchery, or guass rifle. (Must be at least 3 characters)"
          spellCheck={false}
          autoComplete="off"
          name='searchQuery'
          onKeyUp={onSearchKeyUp}
        />
        <input type="hidden" name="intent" value="search" />
        <button type="reset" className="search-input__close">
          &times;
        </button>
      </Form>
    </div>

    <h3>Results for: '{actionData?.searchQuery}'</h3>
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
