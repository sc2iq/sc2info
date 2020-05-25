import { ObjectType, Field, ID, Resolver, Query } from "type-graphql"
import getBalanceData from '../balancedata'
import { Meta } from "./global"

@ObjectType()
export class Command {
    @Field()
    id: number
    @Field()
    index: number
    @Field(type => Meta)
    meta: Meta
}

@ObjectType()
export class Ability {
    @Field(type => ID)
    id: string
    @Field()
    index: number
    @Field(type => [Command])
    command: Command[]
}

@Resolver(of => Ability)
export class AbilitiesResolver {

    @Query(returns => [Ability], {
        description: "Unit abilities such as Blink, PhaseShift, Stim"
    })
    async abilities() {
        const balanceData = await getBalanceData()
        return balanceData.abilities
    }
}