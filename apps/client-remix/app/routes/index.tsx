import { LinksFunction } from '@remix-run/node'
import { Link, NavLink } from '@remix-run/react'
import SearchResult from '~/components/SearchResult'
import indexStyles from '~/styles/index.css'

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: indexStyles },
])

export default function Index() {
  const searchQuery = 'test'
  const searchResults = {
    fetching: true,
    error: {
      message: 'test'
    },
    data: {
      results: [],
      searchAll: [],
    }
  }
  return <>
    <div className="search-header">
      <div className="search-input">
        <div className="search-input__icon">
        </div>
        <input
          className="search-input__control"
          placeholder="Search... zergling, hatchery, or guass rifle. (Must be at least 3 characters)"
          spellCheck={false}
          autoComplete="off"
        />
        <button className="search-input__close">
          &times;
        </button>
      </div>
    </div>

    {1 > 0
      && <h3>Results for: '{searchQuery}'</h3>}
    <section>
      {searchResults.fetching
        && <p>&nbsp;Loading...</p>}

      {searchResults.error
        ? <p>&nbsp;Error! {searchResults.error.message}</p>
        : searchResults.data
        && <div className="search-all-list">
          {(searchResults.data.searchAll as any[]).map((searchResult, i) => {
            const path = 'asdfa'
            return <Link to={`/${path}/${searchResult.item.id}`} key={i}><SearchResult searchAllResult={searchResult} /></Link>
          })}
        </div>}
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
