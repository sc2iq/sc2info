import gql from "graphql-tag"

const typeDefs = gql`
    type Ability {
        id: String
        index: Int
        command: [Command]
    }

    type Command {
        id: Int
        index: Int
        meta: Meta
    }

    "Unit metadata"
    type Meta {
        name: String
        icon: String
        race: String
        hotkey: Int
        source: String
        index: Int
        tooltip: Int
    }

    extend type Query {
        "Unit abilities such as (Blink, PhaseShift, )"
        abilities: [Ability]!
    }
`

export default typeDefs

