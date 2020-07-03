import gql from "graphql-tag"

const typeDefs = gql`
    type RawUnitReference {
        id: String
        name: String
    }

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
        id: String
        meta: Meta
        life: Health
        armor: Health
        shieldArmor: Health
        requires: String
        cost: Cost
        movement: Movement
        score: Score
        misc: Misc
        producer: String
        # attributes: [String]
        strengths: [RawUnitReference]
        weaknesses: [RawUnitReference]
        weapons: [Weapon]
        abilities: [Ability]
        # builds: [Unit]
        # trains: [Unit]
        upgrades: [RawUpgradeLevels]
        # researches: [BuildingUpgrade]
    }

    type Unit {
        id: String
        original: RawUnit
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
        unit(id: String): Unit

        "Unit in SC2"
        units(depth: Int, first: Int, after: String): Page

        "Paginated list of units with limit and offset."
        unitsByOffset(first: Int, offset: Int): [Unit!]
    }
`

export default typeDefs

