import { ObjectType, Field, Int, Resolver, Query, Arg } from "type-graphql"
import { Cost, Meta } from "./global"
import getBalanceData from "../balancedata"


@ObjectType()
export class Upgrade {
    @Field(type => Int)
    id: number
    @Field(type => Int)
    index: number
    @Field()
    meta: Meta
    @Field(type => Int)
    ability: number
    @Field()
    cost: Cost
}

@Resolver(of => Upgrade)
export class UpgradesResolver {

    @Query(returns => [Upgrade], {
        description: "List of upgrades such as (Stim, Speed, Blink)"
    })
    async upgrades(): Promise<Upgrade[]> {
        const balanceData = await getBalanceData()

        return balanceData.upgrades
    }

    @Query(returns => Upgrade)
    async upgrade(
        @Arg("id")id: string
    ): Promise<Upgrade> {
        const balanceData = await getBalanceData()

        const upgrade = balanceData.upgrades.find(u => u.id === id)
        if (!upgrade) {
            throw Error(`Could not find upgrade by id ${id}`)
        }

        return upgrade
    }
}
