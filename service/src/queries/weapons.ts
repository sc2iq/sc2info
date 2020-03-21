import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Weapon from '../schema/weapon'

export default {
    type: new graphql.GraphQLList(Weapon),
    description: 'Weapons such as (Gauss Rifle, Thor Javeline Missile, Baneling Acid)',
    async resolve() {
        return (await getBalanceData()).weapons
    },
}
