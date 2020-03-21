import * as graphql from 'graphql'

export const Misc = new graphql.GraphQLObjectType({
    name: 'Misc',
    description: 'Unit miscallaneous related stats',
    fields: () => ({
        radius: { type: graphql.GraphQLFloat },
        cargoSize: { type: graphql.GraphQLInt },
        footprint: { type: graphql.GraphQLString },
        sightRadius: { type: graphql.GraphQLFloat },
        supply: { type: graphql.GraphQLInt },
        speed: { type: graphql.GraphQLFloat },
        targets: { type: graphql.GraphQLString },
    }),
})

export default Misc
