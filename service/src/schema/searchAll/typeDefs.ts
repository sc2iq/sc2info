import gql from "graphql-tag"

const typeDefs = gql`
    "Generic Search item"
    type GenericSearchItem {
        name: String
        id: String
        type: String
        icon: String
        race: String
    }

    "Match Type"
    type MatchType {
        indices: [[Int]]
        key: String
        value: String
    }
    
    type SearchItem {
        string: String
        index: Int
        score: Int
        original: SearchResult
    }

    union SearchResult = Unit | Building | Weapon | Ability | Upgrade

    "Search Item"
    type FuseResult {
        item: GenericSearchItem
        matches: [MatchType]
        score: Float
    }

    extend type Query {
        "Search everything (units, buildings, weapons, and upgrades) by name"
        searchAll(query: String): [FuseResult!]!
    }
`

export default typeDefs

