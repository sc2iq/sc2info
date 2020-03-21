import * as graphql from 'graphql'
import { IBalanceData, default as getBalanceData } from '../balancedata'
import Unit from '../schema/unit'
import * as pagination from '../schema/pagination'

function getNodeRelationships(node: any, depth: number, balanceData: IBalanceData) {
    if (depth <= 0) {
        return node
    }

    if (node.strengths && node.strengths.length > 0 && typeof node.strengths[0] === 'number') {
        const strengthsUnits = (node.strengths as number[])
            .map(unitId => balanceData.units.find(x => x.id === unitId))
            .filter(x => x)

        node.strengths = strengthsUnits
    }

    node.strengths.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.weaknesses && node.weaknesses.length > 0 && typeof node.weaknesses[0] === 'number') {
        const weaknessUnits = (node.weaknesses as number[])
            .map(unitId => balanceData.units.find(x => x.id === unitId))
            .filter(x => x)

        node.weaknesses = weaknessUnits
    }

    node.weaknesses.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.weapons && node.weapons.length > 0 && typeof node.weapons[0] === 'number') {
        const weaponUnits = (node.weapons as number[])
            .map(unitId => balanceData.weapons.find(x => x.id === unitId))
            .filter(x => x)

        node.weapons = weaponUnits
    }

    node.weapons.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.upgrades && node.upgrades.length > 0 && typeof node.upgrades[0] === 'number') {
        const upgrades = (node.upgrades as number[])
            .map(unitId => balanceData.upgrades.find(x => x.id === unitId))
            .filter(x => x)

        node.upgrades = upgrades
    }

    node.upgrades.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    return node
}

export default {
    type: pagination.Page(Unit),
    description: "Return the 'first' X number of items 'after' the specified cursor'",
    args: {
        depth: {
            type: graphql.GraphQLInt,
            description:
                'Limits the depth of recursing when choosing to return fields which are other units. (Strengths, Weaknesses, Requires, Producedby, etc)',
        },
        first: {
            type: graphql.GraphQLInt,
            description: 'Limits the number of results returned in the page. Defaults to 10.',
        },
        after: {
            type: graphql.GraphQLString,
            description: 'The cursor value of an item returned in previous page. An alternative to in integer offset.',
        },
    },
    async resolve(_: any, { depth = 0, first = 10, after }: { depth: number; first: number; after: string }) {
        const balanceData = await getBalanceData()
        let afterIndex: number = 0

        // If depth over max throw error.
        if (depth > 10) {
            throw new Error(`depth must not be greater than 10`)
        }

        // Get ID from after argument or default to first item.
        if (typeof after === 'string') {
            let id = pagination.convertCursorToNodeId(after)
            if (typeof id === 'number') {
                const matchingIndex = balanceData.units.findIndex(unit => unit.id === id)
                if (matchingIndex != -1) {
                    afterIndex = matchingIndex
                }
            }
        }

        // Add 1 to exclude item matching after index.
        const sliceIndex = afterIndex + 1

        const edges = balanceData.units.slice(sliceIndex, sliceIndex + first).map(node => ({
            node,
            cursor: pagination.convertNodeToCursor(node),
        }))

        // If strengths and weaknesses are required fetch them
        edges.forEach(edge => {
            getNodeRelationships(edge.node, depth, balanceData)
        })

        const startCursor = edges.length > 0 ? pagination.convertNodeToCursor(edges[0].node) : null
        const endCursor = edges.length > 0 ? pagination.convertNodeToCursor(edges[edges.length - 1].node) : null
        const hasNextPage = balanceData.units.length > sliceIndex + first

        return {
            totalCount: balanceData.units.length,
            edges,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
            },
        }
    },
}
