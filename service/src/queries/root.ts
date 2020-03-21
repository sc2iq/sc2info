import * as graphql from 'graphql'
import abilities from './abilities'
import attributes from './attributes'
import building from './building'
import buildings from './buildings'
import searchAll from './searchAll'
import unit from './unit'
import units from './units'
import unitsByOffset from './unitsByOffset'
import upgrade from './upgrade'
import upgrades from './upgrades'
import weapon from './weapon'
import weapons from './weapons'

const Query = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'Root of all queries for SC2 API',
    fields: () =>
        ({
            abilities,
            attributes,
            building,
            buildings,
            searchAll,
            unit,
            units,
            unitsByOffset,
            upgrade,
            upgrades,
            weapon,
            weapons,
        } as any),
})

const Schema = new graphql.GraphQLSchema({
    query: Query,
})

export default Schema
