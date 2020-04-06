import getBalanceData from '../../balancedata'

const Query = {
    building: async (_: any, { id }: any) => {
        const balanceData = await getBalanceData()

        const building = balanceData.buildings.find(building => building.id === id)
        if (!building) {
            throw new Error(`Not found. Could not find building with id: ${id}.`)
        }

        return building
    },
    buildings: async () => {
        const balanceData = await getBalanceData()
        return balanceData.buildings
    },
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}