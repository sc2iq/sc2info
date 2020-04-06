import gql from "graphql-tag"

const typeDefs = gql`

    type RawUpgradeLevel {
        id: String
        index: Int
        meta: Meta
        cost: Cost
    }

    type RawUpgradeLevels {
        id: String
        name: String
        levels: [RawUpgradeLevel]
    }

    "A un-processed unit of terran, zerg, or protoss."
    type RawUnit {
        id: Int
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
        attributes: String
        strengths: Unit
        weaknesses: Unit
        weapons: Weapon
        abilities: String
        # builds: [Unit]
        # trains: [Unit]
        upgrades: [RawUpgradeLevels]
        # researches: [BuildingUpgrade]
    }

    type Unit {
        id: Int
        original: RawUnit
        meta: Meta
        life: Health
        armor: Health
        shieldArmor: Health
        requires: [Int]
        cost: Cost
        movement: Movement
        score: Score
        misc: Misc
        producer: Int
        attributes: [String]
        strengths: [Unit]
        weaknesses: [Unit]
        weapons: [Weapon]
        abilities: [String]
        # builds: [Unit]
        # trains: [Unit]
        upgrades: [Upgrade]
        # researches: [BuildingUpgrade]
    }

    extend type Query {
        "A unit of Terran, Zerg, or Protoss."
        unit(id: Int): Unit

        "Unit in SC2"
        units(depth: Int, first: Int, after: String): Page

        "Paginated list of units with limit and offset."
        unitsByOffset(first: Int, offset: Int): [Unit!]
    }
`

export default typeDefs

