import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Upgrade from '../schema/upgrade'

export default {
    type: new graphql.GraphQLList(Upgrade),
    description: 'List of upgrades such as (Stim, Speed, Blink)',
    async resolve() {
        return (await getBalanceData()).upgrades
    },
}
