import * as graphql from 'graphql'

export function SearchItem(itemType: any) {
    return new graphql.GraphQLObjectType({
        name: 'SearchItem',
        description: 'Search item',
        fields: () => ({
            string: { type: graphql.GraphQLString },
            index: { type: graphql.GraphQLInt },
            score: { type: graphql.GraphQLInt },
            original: { type: itemType },
        }),
    })
}

export default SearchItem
