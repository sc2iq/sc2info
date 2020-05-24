import { ObjectType, Int, Float, Field } from "type-graphql"

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
export class Cost {
    @Field()
    minerals: number
    @Field()
    vespene: number
    @Field()
    time: number
    @Field()
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
    @Field(type => Int)
    regenRate: number
    @Field(type => Int)
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