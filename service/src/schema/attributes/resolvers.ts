import getBalanceData from '../../balancedata'

const Query = {
    attributes: async () => {
        const balanceData = await getBalanceData()

        return balanceData.attributes
    },
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}