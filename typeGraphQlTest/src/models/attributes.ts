import { Resolver, Query } from "type-graphql"
import getBalanceData from '../balancedata'

@Resolver(String)
export class AttributesResolver {

    @Query(returns => [String], {
        description: "Unit attributes such as (light, armored, mechanical)",
    })
    async attributes() {
        const balanceData = await getBalanceData()

        return balanceData.attributes
    }
}