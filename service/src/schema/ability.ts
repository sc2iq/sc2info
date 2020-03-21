import * as graphql from 'graphql'
import Command from './command'

export const Ability = new graphql.GraphQLObjectType({
    name: 'Ability',
    description: 'Unit ability such as (Blink, PhaseShift, )',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        index: { type: graphql.GraphQLInt },
        command: { type: new graphql.GraphQLList(Command) },
    }),
})

export default Ability
