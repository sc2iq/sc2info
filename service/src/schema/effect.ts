import * as graphql from 'graphql'
import Bonus from './bonus'

export const Effect = new graphql.GraphQLObjectType({
    name: 'Effect',
    description: 'Unit effect related stats',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        index: { type: graphql.GraphQLInt },
        radius: { type: graphql.GraphQLFloat },
        max: { type: graphql.GraphQLInt },
        death: { type: graphql.GraphQLString },
        kind: { type: graphql.GraphQLString },
        bonus: { type: Bonus },
    }),
})

export default Effect
