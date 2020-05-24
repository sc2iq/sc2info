import { ObjectType, Field, Float, Int, Resolver, Arg, Query } from "type-graphql"
import getBalanceData from '../balancedata'
import { Health, Cost, Movement, Score, Misc, Meta } from "./global"

@ObjectType("Building", {
    description: "Barracks, Gateway, Spawning Pool"
})
export class Building {
    @Field()
    id: number
    @Field()
    index: number
    @Field()
    meta: Meta
    @Field()
    life: Health
    @Field()
    armor: Health
    @Field()
    shieldArmor: Health
    @Field()
    requires: number
    @Field()
    cost: Cost
    @Field()
    movement: Movement
    @Field()
    score: Score
    @Field()
    misc: Misc
    @Field()
    producer: number
    @Field(type => [String])
    attributes: string[]
    @Field(type => [Number])
    strengths: number[]
    @Field(type => [Number])
    weaknesses: number[]
    @Field(type => [Number])
    weapons: number[]
    @Field(type => [Number])
    abilities: string[]
    // @Field(type => [number])
    // # builds: number[]
    @Field(type => [Number])
    trains: number[]
    @Field(type => [Number])
    upgrades: number[]
    @Field(type => [Number])
    researches: number[]
}


@Resolver(of => Building)
export class BuildingResolver {

    @Query(returns => Building)
    async building(@Arg("id") id: number) {
        const balanceData = await getBalanceData()

        const building = balanceData.buildings.find(building => building.id === id)
        if (!building) {
            throw new Error(`Not found. Could not find building with id: ${id}.`)
        }

        return building
    }

    @Query(returns => [Building], {
        description: "Buildings such as (Nexus, Barracks, Gateway, Pylon, etc)",
    })
    async buildings() {

    }
}