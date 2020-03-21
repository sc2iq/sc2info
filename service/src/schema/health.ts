import * as graphql from 'graphql'

export const Health = new graphql.GraphQLObjectType({
    name: 'Health',
    description: 'Unit health related stats',
    fields: () => ({
        start: { type: graphql.GraphQLInt },
        max: { type: graphql.GraphQLInt },
        regenRate: { type: graphql.GraphQLInt },
        delay: { type: graphql.GraphQLInt },
    }),
})

export default Health
