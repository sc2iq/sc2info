import gql from "graphql-tag"

export const typeDefs = gql`
    type PageInfo {
        "Information about current page"
        startCursor: String
        endCursor: String
        hasNextPage: Boolean
    }

    type Page {
        totalCount: Int
        edges: [Edge]
        pageInfo: PageInfo
    }

    type Edge {
        node: Unit
        cursor: String
    }
`

export function convertNodeToCursor(node: { id: number }): string {
    return bota(node.id.toString())
}

export function bota(input: string): string {
    return Buffer.from(input, 'binary').toString('base64')
}

export function convertCursorToNodeId(cursor: string): number {
    return parseInt(atob(cursor))
}

export function atob(input: string): string {
    return Buffer.from(input, 'base64').toString('binary')
}
