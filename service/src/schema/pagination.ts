import * as graphql from 'graphql'

export function Edge(itemType: any) {
    return new graphql.GraphQLObjectType({
        name: 'Edge',
        description: 'Generic edge to allow cursors',
        fields: () => ({
            node: { type: itemType },
            cursor: { type: graphql.GraphQLString },
        }),
    })
}

export const PageInfo = new graphql.GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about current page',
    fields: () => ({
        startCursor: { type: graphql.GraphQLString },
        endCursor: { type: graphql.GraphQLString },
        hasNextPage: { type: graphql.GraphQLBoolean },
    }),
})

export function Page(itemType: any) {
    return new graphql.GraphQLObjectType({
        name: 'Page',
        description: 'Page',
        fields: () => ({
            totalCount: { type: graphql.GraphQLInt },
            edges: { type: new graphql.GraphQLList(Edge(itemType)) },
            pageInfo: { type: PageInfo },
        }),
    })
}

export function convertNodeToCursor(node: { id: number }): string {
    return bota(node.id.toString())
}

export function bota(input: string): string {
    return new Buffer(input.toString(), 'binary').toString('base64')
}

export function convertCursorToNodeId(cursor: string): number {
    return parseInt(atob(cursor))
}

export function atob(input: string): string {
    return new Buffer(input, 'base64').toString('binary')
}
