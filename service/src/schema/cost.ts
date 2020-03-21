import * as graphql from 'graphql'

export const Cost = new graphql.GraphQLObjectType({
    name: 'Cost',
    description: 'Unit cost related stats',
    fields: () => ({
        minerals: { type: graphql.GraphQLInt },
        vespene: { type: graphql.GraphQLInt },
        time: { type: graphql.GraphQLInt },
        supply: { type: graphql.GraphQLInt },
    }),
})

export default Cost
