import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Weapon from '../schema/weapon'

export default {
    type: Weapon,
    description: 'Weapon',
    args: {
        id: { type: graphql.GraphQLInt },
    },
    async resolve(_: any, { id }: { id: number }) {
        const balanceData = await getBalanceData()
        const weapon = balanceData.weapons.find(w => w.id === id)
        if (!weapon) {
            throw new Error(`Not found. Could not find weapon with id: ${id}.`)
        }

        return weapon
    },
}
