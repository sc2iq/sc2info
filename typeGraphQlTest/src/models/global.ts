import { ObjectType, Int, Float, Field } from "type-graphql"

@ObjectType("Metadata", {
    description: "metadata description",
})
export class Meta {
    @Field({ nullable: true })
    name: string
    @Field({ nullable: true })
    icon: string
    @Field({ nullable: true })
    race: string
    @Field({ nullable: true })
    hotkey: number
    @Field({ nullable: true })
    source: string
    @Field({ nullable: true })
    index: number
    @Field({ nullable: true })
    tooltip: number
}

@ObjectType()
export class Cost {
    @Field(type => Int, { nullable: true })
    minerals: number
    @Field(type => Int, { nullable: true })
    vespene: number
    @Field(type => Int, { nullable: true })
    time: number
    @Field(type => Int, { nullable: true })
    supply: number
}

@ObjectType("Health", {
    description: "Unit health related stats",
})
export class Health {
    @Field(type => Int)
    start: number
    @Field(type => Int)
    max: number
    @Field(type => Int, { nullable: true })
    regenRate: number
    @Field(type => Int, { nullable: true })
    delay: number
}

@ObjectType()
export class Movement {
    @Field(type => Float)
    speed: number
    @Field(type => Float)
    acceleration: number
    @Field(type => Float)
    deceleration: number
    @Field(type => Float)
    turnRate: number
}

@ObjectType("Score", {
    description: "Unit score related stats"
})
export class Score {
    @Field(type => Int)
    build: number
    @Field(type => Int)
    kill: number
}

@ObjectType("Miscellaneous", {
    description: "Unit miscellaneous related stats",
})
export class Misc {
    @Field(type => Float)
    radius: number
    @Field(type => Int)
    cargoSize: number
    @Field()
    footprint: string
    @Field(type => Float)
    sightRadius: number
    @Field(type => Int)
    supply: number
    @Field(type => Float)
    speed: number
    @Field()
    targets: string
}