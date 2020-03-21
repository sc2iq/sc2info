import * as graphql from 'graphql'

export const WeaponMisc = new graphql.GraphQLObjectType({
    name: 'WeaponMisc',
    description: 'Weapon miscallaneous related stats',
    fields: () => ({
        range: { type: graphql.GraphQLInt },
        speed: { type: graphql.GraphQLFloat },
        targets: { type: graphql.GraphQLString },
    }),
})

export default WeaponMisc
