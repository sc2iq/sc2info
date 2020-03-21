import * as graphql from 'graphql'

export const Movement = new graphql.GraphQLObjectType({
    name: 'Movement',
    description: 'Unit movement related stats',
    fields: () => ({
        speed: { type: graphql.GraphQLFloat },
        acceleration: { type: graphql.GraphQLFloat },
        deceleration: { type: graphql.GraphQLFloat },
        turnRate: { type: graphql.GraphQLFloat },
    }),
})

export default Movement
