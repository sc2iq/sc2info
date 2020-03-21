import * as graphql from 'graphql'
import Meta from './meta'
import Misc from './misc'
import Health from './health'
import Cost from './cost'
import Movement from './movement'
import Score from './score'

export const Building = new graphql.GraphQLObjectType({
    name: 'Building',
    description: 'Building',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        index: { type: graphql.GraphQLInt },
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
        strengths: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        weaknesses: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        weapons: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        abilities: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        // builds: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        trains: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        upgrades: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
        researches: { type: new graphql.GraphQLList(graphql.GraphQLInt) },
    }),
})

export default Building
