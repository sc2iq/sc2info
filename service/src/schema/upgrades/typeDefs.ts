import gql from "graphql-tag"

const typeDefs = gql`
    type Upgrade {
        id: String
        index: Int
        meta: Meta
        ability: Int
        cost: Cost
    }

    extend type Query {
        "List of upgrades such as (Stim, Speed, Blink)"
        upgrades: [Upgrade!]!

        upgrade(id: String): Upgrade
    }
`

export default typeDefs

