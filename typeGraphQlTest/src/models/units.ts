import { ObjectType, Field, Int } from "type-graphql"
import { Cost, Meta } from "./global"

@ObjectType()
export class Unit {
    @Field(type => Int)
    id: number
    @Field()
    meta: Meta
    @Field()
    cost: Cost
}