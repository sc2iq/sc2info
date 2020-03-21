import * as graphql from 'graphql'
import getBalanceData from '../balancedata'

export default {
    type: new graphql.GraphQLList(graphql.GraphQLString),
    description: 'Unit attributes such as (light, armored, mechanical)',
    resolve: async () => {
        return (await getBalanceData()).attributes
    },
}
