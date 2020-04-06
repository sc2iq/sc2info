import getBalanceData from '../../balancedata'

const Query = {
    abilities: async () => {
        const balanceData = await getBalanceData()

        return balanceData.abilities
    },
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}