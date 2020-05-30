import React from 'react'
import RaceImg from './RaceImg'
import FuseMatch from './FuseMatch'
import { convertMatchedTextIntoMatchedSegements } from '../utilities'
import './SearchResult.css'

type Props = {
    searchAllResult: any
}

const Component: React.FC<Props> = ({ searchAllResult }) => { 
    const match = searchAllResult.matches[0]
    const indices = match ? match.indices : []
    const matches = convertMatchedTextIntoMatchedSegements(searchAllResult.item.name, indices)
    return (
        <div className="search-all">
            <div className="search-all__picture">
                <object data={searchAllResult.item.icon} type="image/png"  width="80" height="80" >
                    <div>Image Not Found</div>
                </object>
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

export default Component