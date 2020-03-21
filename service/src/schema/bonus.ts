import * as graphql from 'graphql'

export const Bonus = new graphql.GraphQLObjectType({
    name: 'Bonus',
    description: 'Weapon bonus effect related stats',
    fields: () => ({
        damage: { type: graphql.GraphQLInt },
        max: { type: graphql.GraphQLInt },
        type: { type: graphql.GraphQLString },
    }),
})

export default Bonus
