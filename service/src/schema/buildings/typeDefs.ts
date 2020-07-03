import gql from "graphql-tag"

const typeDefs = gql`
    type Building {
        id: String
        index: Int
        meta: Meta
        life: Health
        armor: Health
        shieldArmor: Health
        requires: [String]
        cost: Cost
        movement: Movement
        score: Score
        misc: Misc
        producer: String
        attributes: [String]
        strengths: [String]
        weaknesses: [String]
        weapons: [String]
        abilities: [String]
        # builds: [String]
        trains: [String]
        upgrades: [String]
        researches: [String]
    }

    type Cost {
        minerals: Int
        vespene: Int
        time: Int
        supply: Int
    }

    type Health {
        "Unit health related stats"
        start: Int
        max: Int
        regenRate: Int
        delay: Int
    }

    type Movement {
        speed: Float
        acceleration: Float
        deceleration: Float
        turnRate: Float
    }

    type Score {
        "Unit score related stats"
        build: Int
        kill: Int
    }

    type Misc {
        "Unit miscellaneous related stats"
        radius: Float
        cargoSize: Int
        footprint: String
        sightRadius: Float
        supply: Int
        speed: Float
        targets: String
    }

    extend type Query {
        building(id: String): Building

        "Buildings such as (Nexus, Barracks, Gateway, Pylon, etc)"
        buildings: [Building!]!
    }
`

export default typeDefs

