import { ObjectType, Field, ID, Resolver, Query } from "type-graphql"


@ObjectType("Metadata", {
    description: "metadata description",
})
export class Meta {
    @Field()
    name: string
    @Field()
    icon: string
    @Field()
    race: string
    @Field()
    hotkey: number
    @Field()
    source: string
    @Field()
    index: number
    @Field()
    tooltip: number
}

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

    @Query(returns => [Ability])
    async abilities() {
        return []
    }
}