import { ObjectType, Field, Int, Resolver, Query, Arg, Float } from "type-graphql"
import { Meta } from "./global"
import getBalanceData from "../balancedata"

@ObjectType({
    description: "Weapon miscellaneous related stats"
})
export class WeaponMisc {
    @Field(type => Int)
    range: number
    @Field(type => Float)
    speed: number
    @Field()
    targets: string
}

@ObjectType()
export class Bonus {
    @Field(type => Int)
    damage: number
    @Field(type => Int)
    max: number
    @Field()
    type: string
}

@ObjectType()
export class Effect {
    @Field()
    id: string
    @Field(type => Int)
    index: number
    @Field(type => Float)
    radius: number
    @Field(type => Int)
    max: number
    @Field()
    death: string
    @Field()
    kind: string
    @Field({ nullable: true })
    bonus: Bonus
}

@ObjectType()
export class Weapon {
    @Field(type => Int)
    id: number
    @Field(type => Int)
    index: number
    @Field()
    meta: Meta
    @Field({ nullable: true })
    misc: WeaponMisc
    @Field()
    effect: Effect
}

@Resolver(of => Weapon)
export class WeaponsResolver {

    @Query(returns => [Weapon], {
        description: "Weapons such as (Gauss Rifle, Thor Javeline Missile, Baneling Acid)"
    })
    async weapons(): Promise<Weapon[]> {
        const balanceData = await getBalanceData()

        return balanceData.weapons
    }

    @Query(returns => Weapon)
    async weapon(
        @Arg("id", type => Int) id: number
    ): Promise<Weapon> {
        const balanceData = await getBalanceData()

        const weapon = balanceData.weapons.find(w => w.id === id)
        if (!weapon) {
            throw Error(`Could not find weapon by id ${id}`)
        }

        return weapon
    }
}
