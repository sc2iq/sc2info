import { ObjectType, Field, Float } from "type-graphql"
import { Unit } from "./models/units"

@ObjectType({
    description: "Information about current page"
})
export class PageInfo {
    @Field()
    startCursor: string
    @Field()
    endCursor: string
    @Field()
    hasNextPage: boolean
}

@ObjectType()
export class Edge {
    @Field(type => Unit)
    node: Unit
    @Field()
    cursor: string
}

@ObjectType()
export class Page {
    @Field()
    totalCount: number
    @Field(type => Edge)
    edges: Edge[]
    @Field(type => PageInfo)
    pageInfo: PageInfo
}

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
