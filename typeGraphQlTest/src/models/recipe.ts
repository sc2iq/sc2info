import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class Recipe {
    @Field()
    id: string

    @Field()
    title: string

    @Field()
    averageRating: number
}

export default Recipe