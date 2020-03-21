import * as graphql from 'graphql'

export const Score = new graphql.GraphQLObjectType({
    name: 'Score',
    description: 'Unit score related stats',
    fields: () => ({
        build: { type: graphql.GraphQLInt },
        kill: { type: graphql.GraphQLInt },
    }),
})

export default Score
