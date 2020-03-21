import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Upgrade from '../schema/upgrade'

export default {
    type: Upgrade,
    description: 'Find upgrade by id',
    args: {
        id: { type: graphql.GraphQLInt },
    },
    async resolve(_: any, { id }: { id: number }) {
        const balanceData = await getBalanceData()
        const upgrade = balanceData.upgrades.find(upgrade => upgrade.id === id)
        if (!upgrade) {
            throw new Error(`Not found. Could not find upgrade with id: ${id}.`)
        }

        return upgrade
    },
}
