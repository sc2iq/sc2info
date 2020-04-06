import gql from "graphql-tag"

const typeDefs = gql`
    type Building {
        id: Int
        index: Int
        meta: Meta
        life: Health
        armor: Health
        shieldArmor: Health
        requires: Int
        cost: Cost
        movement: Movement
        score: Score
        misc: Misc
        producer: Int
        attributes: [String]
        strengths: [Int]
        weaknesses: [Int]
        weapons: [Int]
        abilities: [String]
        # builds: [Int]
        trains: [Int]
        upgrades: [Int]
        researches: [Int]
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
        building(id: Int): Building

        "Buildings such as (Nexus, Barracks, Gateway, Pylon, etc)"
        buildings: [Building!]!
    }
`

export default typeDefs

