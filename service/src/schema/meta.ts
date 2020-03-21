import * as graphql from 'graphql'

export const Meta = new graphql.GraphQLObjectType({
    name: 'Meta',
    description: 'Unit metadata',
    fields: () => ({
        name: { type: graphql.GraphQLString },
        icon: { type: graphql.GraphQLString },
        race: { type: graphql.GraphQLString },
        hotkey: { type: graphql.GraphQLInt },
        source: { type: graphql.GraphQLString },
        index: { type: graphql.GraphQLInt },
        tooltip: { type: graphql.GraphQLInt },
    }),
})

export default Meta
