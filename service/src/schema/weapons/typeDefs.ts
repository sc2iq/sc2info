import gql from "graphql-tag"

const typeDefs = gql`
    type Weapon {
        id: Int
        index: Int
        meta: Meta
        misc: WeaponMisc
        effect: Effect
    }

    type Effect {
        id: String
        index: Int
        radius: Float
        max: Int
        death: String
        kind: String
        bonus: Bonus
    }

    type Bonus {
        damage: Int
        max: Int
        type: String
    }

    "Weapon miscellaneous related stats"
    type WeaponMisc {
        range: Int
        speed: Float
        targets: String
    }

    extend type Query {
        "Weapons such as (Gauss Rifle, Thor Javeline Missile, Baneling Acid)"
        weapons: [Weapon!]!

        weapon(id: Int): Weapon
    }
`

export default typeDefs

