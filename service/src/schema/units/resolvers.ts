import getBalanceData, { IBalanceData } from '../../balancedata'
import * as pagination from '../pagination'

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

const Query = {
    units: async (_: any, { depth = 0, first = 10, after }: { depth: number; first: number; after: string }) => {
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

    unit: async (_: any, { id }: any) => {
        const balanceData = await getBalanceData()
        const unit = balanceData.units.find(unit => unit.id === id)
        if (!unit) {
            throw new Error(`Not Found. Could not find unit with id matching: ${id}`)
        }

        if (unit.weapons && unit.weapons.length > 0 && typeof unit.weapons[0] === 'number') {
            const weaponUnits = (unit.weapons as number[])
                .map(unitId => balanceData.weapons.find(x => x.id === unitId))
                .filter(x => x)

            unit.weapons = weaponUnits
        }

        if (unit.upgrades && unit.upgrades.length > 0 && typeof unit.upgrades[0] === 'number') {
            const upgrades = (unit.upgrades as number[])
                .map(unitId => balanceData.upgrades.find(x => x.id === unitId))
                .filter(x => x)

            unit.upgrades = upgrades
        }

        return unit
    },

    unitsByOffset: async (_: any, { first = 10, offset = 0 }: { first: number; offset: number }) => {
        if (first < 0) {
            throw new Error(`argument: 'first' must not be less than 0. You passed: ${first}`)
        }
        if (offset < 0) {
            throw new Error(`argument: 'offset' must not be less than 0. You passed: ${offset}`)
        }

        const balanceData = await getBalanceData()

        return balanceData.units.slice(offset, offset + first)
    },
}

const Mutation = {
}

export default {
    Query,
    Mutation,
}