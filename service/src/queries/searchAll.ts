import * as graphql from 'graphql'
import { IBalanceData, default as getBalanceData } from '../balancedata'
import Fuse from 'fuse.js'

interface IGenericSearchItem {
    name: string
    query: string
    id: number
    icon: string
    race: string
}

function convertUnitToGenericSearchItem(unit: any): IGenericSearchItem {
    return {
        name: unit.meta.name,
        query: 'unit',
        id: unit.id,
        icon: unit.meta.icon,
        race: unit.meta.race,
    }
}

function convertWeaponToGenericSearchItem(weapon: any): IGenericSearchItem {
    return {
        name: weapon.meta.name,
        query: 'weapon',
        id: weapon.id,
        icon: weapon.meta.icon,
        race: weapon.meta.race,
    }
}

function convertUpgradeToGenericSearchItem(upgrade: any): IGenericSearchItem {
    return {
        name: upgrade.meta.name,
        query: 'upgrade',
        id: upgrade.id,
        icon: upgrade.meta.icon,
        race: upgrade.meta.race,
    }
}

function convertBuildingToGenericSearchItem(building: any): IGenericSearchItem {
    return {
        name: building.meta.name,
        query: 'building',
        id: building.id,
        icon: building.meta.icon,
        race: building.meta.race,
    }
}

function convertAbilityToGenericSearchItem(ability: any): IGenericSearchItem {
    const command = ability.command[0]
    return {
        name: ability.id,
        query: 'ability',
        id: -1, // TODO: ability.id, Type of id field is number so assigning string gets turned into null
        icon: command.meta.icon,
        race: command.meta.race,
    }
}

function convertToGenericSearchList(balanceData: IBalanceData): IGenericSearchItem[] {
    return [
        ...balanceData.units.map(convertUnitToGenericSearchItem),
        ...balanceData.weapons.map(convertWeaponToGenericSearchItem),
        ...balanceData.upgrades.map(convertUpgradeToGenericSearchItem),
        ...balanceData.buildings.map(convertBuildingToGenericSearchItem),
        ...balanceData.abilities.map(convertAbilityToGenericSearchItem),
    ]
}

const GenericSearchItem = new graphql.GraphQLObjectType({
    name: 'GenericSearchItem',
    description: 'Generic Search item',
    fields: () => ({
        name: { type: graphql.GraphQLString },
        id: { type: graphql.GraphQLInt },
        query: { type: graphql.GraphQLString },
        icon: { type: graphql.GraphQLString },
        race: { type: graphql.GraphQLString },
    }),
})

const MatchType = new graphql.GraphQLObjectType({
    name: 'FuseMatchType',
    description: 'Generic Search item',
    fields: () => ({
        indices: { type: new graphql.GraphQLList(new graphql.GraphQLList(graphql.GraphQLInt)) },
        key: { type: graphql.GraphQLString },
        value: { type: graphql.GraphQLString },
    }),
})

function GraphqlFuseResult(itemType: any) {
    return new graphql.GraphQLObjectType({
        name: 'GraphqlFuseResult',
        description: 'Search item',
        fields: () => ({
            item: { type: itemType },
            matches: { type: new graphql.GraphQLList(MatchType) },
            score: { type: graphql.GraphQLFloat },
        }),
    })
}

let list: IGenericSearchItem[] = []
const options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 50,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
        "name",
    ],
    includeMatches: true as true,
    includeScore: true as true,
}
let fuse = new Fuse(list, options)

export default {
    type: new graphql.GraphQLList(GraphqlFuseResult(GenericSearchItem)),
    description: 'Serach everything (units, buildings, weapons, and upgrades) by name',
    args: {
        query: {
            type: graphql.GraphQLString,
            description: 'Search input',
        },
    },
    async resolve(_: any, { query }: { query: string }) {
        if (list.length === 0) {
            const balanceData = await getBalanceData()
            list = convertToGenericSearchList(balanceData)
            fuse = new Fuse(list, options)
        }

        const fuseResults = fuse.search(query)

        return fuseResults
    },
}
