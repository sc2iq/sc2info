import React from 'react'
import RaceImg from './RaceImg'
import FuseMatch from './FuseMatch'
import { convertMatchedTextIntoMatchedSegements } from '../utilities'
import IconImage from './IconImage'

type Props = {
    searchAllResult: any
}

const SearchResult: React.FC<Props> = ({ searchAllResult }) => { 
    const match = searchAllResult.matches[0]
    const indices = match ? match.indices : []
    const matches = convertMatchedTextIntoMatchedSegements(searchAllResult.item.name, indices)
    return (
        <div className="search-all">
            <div className="search-all__picture">
                <IconImage url={searchAllResult.item.icon} />
            </div>
            <div className="search-all__race">
                <RaceImg race={searchAllResult.item.race} />
            </div>
            <div className="search-all__info">
                <span className="search-all__name"><FuseMatch matches={matches} /></span>
                <div>Type: {searchAllResult.item.query} - (Match Score: {searchAllResult.score})</div>
            </div>
        </div>
    )
}

export default SearchResult