import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Ability from '../schema/ability'

export default {
    type: new graphql.GraphQLList(Ability),
    description: 'Unit abilities such as (detect, cloak)',
    resolve: async () => {
        const balanceData = await getBalanceData()

        return balanceData.abilities
    },
}
