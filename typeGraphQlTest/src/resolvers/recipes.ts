import { Resolver, Query } from "type-graphql"
import Recipe from '../models/recipe'

@Resolver(Recipe)
export class RecipeResolver {

    @Query(returns => [Recipe])
    async recipes() {
        return []
    }
}
