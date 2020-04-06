import getBalanceData from '../../balancedata'

const Query = {
    weapons: async () => {
        const balanceData = await getBalanceData()

        return balanceData.weapons
    },

    weapon: async (_: any, { id }: any) => {
        const balanceData = await getBalanceData()

        const weapon = balanceData.weapons.find(w => w.id === id)
        if (!weapon) {
            throw Error(`Could not find weapon by id ${id}`)
        }

        return weapon
    }
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}