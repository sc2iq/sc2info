import * as graphql from 'graphql'
import Meta from './meta'

export const Command = new graphql.GraphQLObjectType({
    name: 'Command',
    description: 'Command that can be executed',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        index: { type: graphql.GraphQLInt },
        meta: { type: Meta },
    }),
})

export default Command
