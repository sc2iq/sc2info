import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Building from '../schema/building'

export default {
    type: Building,
    description: 'Buildings such as (Nexus, Barracks, Gateway, Pylon, etc)',
    args: {
        id: { type: graphql.GraphQLInt },
    },
    async resolve(_: any, { id }: any) {
        const balanceData = await getBalanceData()

        const building = balanceData.buildings.find(building => building.id === id)
        if (!building) {
            throw new Error(`Not found. Could not find building with id: ${id}.`)
        }

        return building
    },
}
