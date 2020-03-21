import * as graphql from 'graphql'
import Meta from './meta'
import Cost from './cost'

export const Upgrade = new graphql.GraphQLObjectType({
    name: 'Upgrade',
    description: 'Upgrade',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        index: { type: graphql.GraphQLInt },
        meta: { type: Meta },
        ability: { type: graphql.GraphQLInt },
        cost: { type: Cost },
    }),
})

export default Upgrade
