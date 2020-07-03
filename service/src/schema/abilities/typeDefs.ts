import gql from "graphql-tag"

const typeDefs = gql`
    type Ability {
        id: String
        index: Int
        command: [Command]
    }

    type Command {
        id: String
        index: Int
        meta: Meta
        misc: AbilityMisc
        cost: AbilityCost
        effect: AbilityEffect
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

    type AbilityMisc {
        range: Int
    }

    type AbilityCost {
        energy: Int
        cooldown: Int
        time: Float
    }

    type AbilityEffect {
        id: String
        index: Int
        radius: Float
    }

    extend type Query {
        "Unit abilities such as (Blink, PhaseShift, )"
        abilities: [Ability]!
    }
`

export default typeDefs

