import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Building from '../schema/building'

export default {
    type: new graphql.GraphQLList(Building),
    async resolve() {
        return (await getBalanceData()).buildings
    },
}
