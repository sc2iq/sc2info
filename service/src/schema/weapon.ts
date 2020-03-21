import * as graphql from 'graphql'
import Meta from './meta'
import WeapnMisc from './weaponmisc'
import Effect from './effect'

export const Weapon = new graphql.GraphQLObjectType({
    name: 'Weapon',
    description: 'Weapon',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        index: { type: graphql.GraphQLInt },
        meta: { type: Meta },
        misc: { type: WeapnMisc },
        effect: { type: Effect },
    }),
})

export default Weapon
