import getBalanceData from '../../balancedata'

const Query = {
    upgrades: async () => {
        const balanceData = await getBalanceData()

        return balanceData.upgrades
    },

    upgrade: async (_: any, { id }: any) => {
        const balanceData = await getBalanceData()

        const upgrade = balanceData.upgrades.find(u => u.id === id)
        if (!upgrade) {
            throw Error(`Could not find upgrade by id ${id}`)
        }

        return upgrade
    }
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}