import * as graphql from 'graphql'
import Meta from './meta'
import Health from './health'
import Cost from './cost'
import Movement from './movement'
import Misc from './misc'
import Score from './score'
import Weapon from './weapon'
import Upgrade from './upgrade'

export const RawUpgradeLevel = new graphql.GraphQLObjectType({
    name: 'RawUpgradeLevel',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        index: { type: graphql.GraphQLInt },
        meta: { type: Meta },
        cost: { type: Cost },
    })
})

export const RawUpgradeLevels = new graphql.GraphQLObjectType({
    name: 'RawUpgradeLevels',
    description: 'A un-processed unit of terran, zerg, or protoss.',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        levels: { type: new graphql.GraphQLList(RawUpgradeLevel) },
    })
})

export const RawUpgrade = new graphql.GraphQLObjectType({
    name: 'RawUpgrade',
    description: 'A un-processed unit of terran, zerg, or protoss.',
    fields: () => ({
        upgrade: { type: new graphql.GraphQLList(RawUpgradeLevels) }
    })
})

export const RawUnit: any = new graphql.GraphQLObjectType({
    name: 'RawUnit',
    description: 'A un-processed unit of terran, zerg, or protoss.',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        meta: { type: Meta },
        life: { type: Health },
        armor: { type: Health },
        shieldArmor: { type: Health },
        requires: { type: graphql.GraphQLInt },
        cost: { type: Cost },
        movement: { type: Movement },
        score: { type: Score },
        misc: { type: Misc },
        producer: { type: graphql.GraphQLInt },
        attributes: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        strengths: { type: new graphql.GraphQLList(Unit) },
        weaknesses: { type: new graphql.GraphQLList(Unit) },
        weapons: { type: new graphql.GraphQLList(Weapon) },
        abilities: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        // builds: IUnit[];
        // trains: IUnit[];
        upgrades: { type: new graphql.GraphQLList(RawUpgradeLevels) },
        // researches: IBuildingUpgrade[];
    }),
})


export const Unit: any = new graphql.GraphQLObjectType({
    name: 'Unit',
    description: 'A controllable unit of terran, zerg, or protoss.',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        original: { type: RawUnit },
        meta: { type: Meta },
        life: { type: Health },
        armor: { type: Health },
        shieldArmor: { type: Health },
        requires: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        cost: { type: Cost },
        movement: { type: Movement },
        score: { type: Score },
        misc: { type: Misc },
        producer: { type: graphql.GraphQLInt },
        attributes: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        strengths: { type: new graphql.GraphQLList(Unit) },
        weaknesses: { type: new graphql.GraphQLList(Unit) },
        weapons: { type: new graphql.GraphQLList(Weapon) },
        abilities: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        // builds: IUnit[];
        // trains: IUnit[];
        upgrades: { type: new graphql.GraphQLList(Upgrade) },
        // researches: IBuildingUpgrade[];
    }),
})

export default Unit
