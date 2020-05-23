
import React from 'react'
import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"
import './Search.css'
import * as urlq from 'urql'
import SearchResult from '../components/SearchResult'

const query = `
query search($searchValue: String) {
    searchAll(query: $searchValue) {
        matches {
            indices
            key
            value
        }
        score
        item {
            name
            id
            type
            icon
            race
        }
    }
}
`

const Component: React.FC = () => {
    const searchIconRef = React.useRef<HTMLInputElement>(null)
    const [searchValue, setSearchValue] = React.useState('')
    const [searchQuery, setQueryValue] = React.useState(searchValue)
    const onClickClear = () => {
        setSearchValue('')
        setQueryValue('')
        if (searchIconRef.current) {
            searchIconRef.current.focus()
        }
    }

    const onChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    const onKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Escape':
                onClickClear()
                break
            case 'Enter':
                setQueryValue(searchValue)
                break
        }
    }

    const pause = searchQuery.length <= 3
    const [searchResults] = urlq.useQuery({
        query,
        variables: {
            searchValue: searchQuery
        },
        pause
    })

    const onClickSearchIcon = () => {
        if (searchIconRef.current) {
            searchIconRef.current.focus()
        }
    }

    React.useEffect(() => {
        if (searchIconRef.current) {
            searchIconRef.current.focus()
        }
    }, [searchIconRef])

    return (
        <>
            <div className="search-header">
                <div className="search-input">
                    <div className="search-input__icon" onClick={onClickSearchIcon}>
                    </div>
                    <input value={searchValue}
                        className="search-input__control"
                        onChange={onChangeSearchInput}
                        onKeyDown={onKeyDownSearchInput}
                        ref={searchIconRef}
                        placeholder="Search..."
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <button className="search-input__close" onClick={onClickClear}>
                        &times;
                    </button>
                </div>
            </div>

            <h3>Results for: '{searchQuery}'</h3>
            <section>
                {pause
                    && <p>Search value must be greater than 3 characters.</p>}

                {searchResults.fetching
                    && <p>&nbsp;Loading...</p>}

                {searchResults.error
                    ? <p>&nbsp;Error! {searchResults.error.message}</p>
                    : searchResults.data
                    && <div className="search-all-list">
                        {(searchResults.data.searchAll as any[]).map((searchResult, i) => {
                            let path = 'units'
                            if (searchResult.item.type === 'upgrade') {
                                path = 'upgrades'
                            }
                            else if (searchResult.item.type === 'weapon') {
                                path = 'weapons'
                            }
                            else if (searchResult.item.type === 'building') {
                                path = 'buildings'
                            }

                            return <Link to={`/${path}/${searchResult.item.id}`} key={i}><SearchResult searchAllResult={searchResult} /></Link>
                        })}
                    </div>}
            </section>
            <section className="search-footer">
                <p>Still can't find the item using search? Try browsing through categories.</p>

                <ul>
                    <li><NavLink to={`/units`}>Units</NavLink></li>
                    <li><NavLink to={`/abilities`}>Abilities</NavLink></li>
                    <li><NavLink to={`/buildings`}>Buildings</NavLink></li>
                    <li><NavLink to={`/upgrades`}>Upgrades</NavLink></li>
                    <li><NavLink to={`/weapons`}>Weapons</NavLink></li>
                </ul>
            </section>
        </>
    )
}

export default Component