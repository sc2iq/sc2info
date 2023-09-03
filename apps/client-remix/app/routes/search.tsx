import { LinksFunction } from '@remix-run/node'
import { Link, NavLink, useOutletContext } from '@remix-run/react'
import SearchResult from '~/components/SearchResult'

export default function Index() {
  const context = useOutletContext()
  console.log({ context })

  const searchQuery = 'test'
  const searchResults: any[] = []
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

    <h3>Results for: '{searchQuery}'</h3>
    <section>
      <div className="search-all-list">
        {searchResults.map((searchResult, i) => {
          const path = 'asdfa'
          return <Link to={`/${path}/${searchResult.id}`} key={i}><SearchResult searchAllResult={searchResult} /></Link>
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
