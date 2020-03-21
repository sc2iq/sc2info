import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Unit from '../schema/unit'

export default {
    type: new graphql.GraphQLList(Unit),
    description: 'Paginated list of units with limit and offset.',
    args: {
        first: {
            type: graphql.GraphQLInt,
            description: 'Limits the size of the returned page. Defaults to 10.',
        },
        offset: {
            type: graphql.GraphQLInt,
            description: 'The number of items to skip or offset',
        },
    },
    async resolve(_: any, { first = 10, offset = 0 }: { first: number; offset: number }) {
        if (first < 0) {
            throw new Error(`argument: 'first' must not be less than 0. You passed: ${first}`)
        }
        if (offset < 0) {
            throw new Error(`argument: 'offset' must not be less than 0. You passed: ${offset}`)
        }

        const balanceData = await getBalanceData()

        return balanceData.units.slice(offset, offset + first)
    },
}
