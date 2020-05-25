import getBalanceData, { IBalanceData } from '../balancedata'
import * as pagination from '../pagination'
import { Resolver, Arg, ArgsType, Field, Int, Args, Query, ObjectType } from 'type-graphql'
import { Cost, Health, Movement, Score, Misc, Meta } from './global'
import { Weapon } from './weapons'
import { Upgrade } from './upgrades'

function getNodeRelationships(node: any, depth: number, balanceData: IBalanceData) {
    if (depth <= 0) {
        return node
    }

    if (node.strengths?.length > 0 && typeof node.strengths[0] === 'number') {
        const strengthsUnits = (node.strengths as number[])
            .map(unitId => balanceData.units.find(x => x.id === unitId))
            .filter(x => x)

        node.strengths = strengthsUnits
    }

    node.strengths.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.weaknesses?.length > 0 && typeof node.weaknesses[0] === 'number') {
        const weaknessUnits = (node.weaknesses as number[])
            .map(unitId => balanceData.units.find(x => x.id === unitId))
            .filter(x => x)

        node.weaknesses = weaknessUnits
    }

    node.weaknesses.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.weapons?.length > 0 && typeof node.weapons[0] === 'number') {
        const weaponUnits = (node.weapons as number[])
            .map(unitId => balanceData.weapons.find(x => x.id === unitId))
            .filter(x => x)

        node.weapons = weaponUnits
    }

    node.weapons.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    if (node.upgrades?.length > 0 && typeof node.upgrades[0] === 'number') {
        const upgrades = (node.upgrades as number[])
            .map(unitId => balanceData.upgrades.find(x => x.id === unitId))
            .filter(x => x)

        node.upgrades = upgrades
    }

    node.upgrades.map((node: any) => getNodeRelationships(node, depth - 1, balanceData))

    return node
}

@ArgsType()
class GraphPageInput {
    @Field(type => Int, {
        nullable: true,
        defaultValue: 0,
    })
    depth: number

    @Field(type => Int, {
        nullable: true,
        defaultValue: 10,
    })
    first: number

    @Field()
    after?: string
}

@ArgsType()
class PageInput {

    @Field(type => Int, {
        nullable: true,
        defaultValue: 10
    })
    first: number

    @Field(type => Int, {
        nullable: true,
        defaultValue: 0
    })
    offset: number
}

@ObjectType()
export class RawUpgradeLevel {
    @Field()
    id: string
    @Field(type => Int)
    index: number
    @Field()
    meta: Meta
    @Field()
    cost: Cost
}

@ObjectType()
export class RawUpgradeLevels {
    @Field()
    id: string
    @Field()
    name: string
    @Field(type => [RawUpgradeLevel])
    levels: RawUpgradeLevel[]
}

@ObjectType()
export class UnitReference {
    @Field(type => Int)
    id: number
    @Field()
    name: string
}

@ObjectType({
    description: "A un-processed unit of terran, zerg, or protoss."
})
export class RawUnit {
    @Field(type => Int)
    id: number
    @Field()
    meta: Meta
    @Field()
    life: Health
    @Field()
    armor: Health
    @Field()
    shieldArmor: Health
    @Field(type => Int)
    requires: number
    @Field()
    cost: Cost
    @Field()
    movement: Movement
    @Field()
    score: Score
    @Field()
    misc: Misc
    @Field(type => Int)
    producer: number
    @Field()
    attributes: string
    @Field(type => [UnitReference])
    strengths: UnitReference[]
    @Field(type => [UnitReference])
    weaknesses: UnitReference[]
    @Field(type => [Weapon])
    weapons: Weapon[]
    @Field(type => [String])
    abilities: string[]
    // @Field()
    // builds: [Unit]
    // @Field()
    // trains: [Unit]
    @Field(type => [RawUpgradeLevels])
    upgrades: RawUpgradeLevels[]
    // @Field()
    // researches: [BuildingUpgrade]
}

@ObjectType()
export class Unit {
    @Field(type => Int)
    id: number
    @Field()
    original: RawUnit
    @Field()
    meta: Meta
    @Field()
    life: Health
    @Field()
    armor: Health
    @Field()
    shieldArmor: Health
    @Field(type => [Int])
    requires: number[]
    @Field()
    cost: Cost
    @Field()
    movement: Movement
    @Field()
    score: Score
    @Field()
    misc: Misc
    @Field(type => Int)
    producer: number
    @Field(type => [String])
    attributes: string[]
    @Field(type => [Unit])
    strengths: Unit[]
    @Field(type => [Unit])
    weaknesses: Unit[]
    @Field(type => [Weapon])
    weapons: Weapon[]
    @Field(type => [String])
    abilities: string[]
    // # builds: [Unit]
    // # trains: [Unit]
    @Field(type => [Upgrade])
    upgrades:  Upgrade[]
    // # researches: [BuildingUpgrade]
}

@Resolver(of => pagination.PageInfo)
export class UnitsResolver {

    @Query(returns => pagination.PageInfo, {
        description: "Unit in SC2",
    })
    async units(
        @Args() { depth, first, after }: GraphPageInput
    ) {

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
    }

    @Query(returns => Unit, {
        description: "A unit of Terran, Zerg, or Protoss."
    })
    async unit(
        @Arg("id") id: number
    ) {
        const balanceData = await getBalanceData()
        const unit = balanceData.units.find(unit => unit.id === id)
        if (!unit) {
            throw new Error(`Not Found.Could not find unit with id matching: ${ id } `)
        }

        if (unit.weapons?.length > 0 && typeof unit.weapons[0] === 'number') {
            const weaponUnits = (unit.weapons as number[])
                .map(unitId => balanceData.weapons.find(x => x.id === unitId))
                .filter(x => x)

            unit.weapons = weaponUnits
        }

        if (unit.upgrades?.length > 0 && typeof unit.upgrades[0] === 'number') {
            const upgrades = (unit.upgrades as number[])
                .map(unitId => balanceData.upgrades.find(x => x.id === unitId))
                .filter(x => x)

            unit.upgrades = upgrades
        }

        return unit
    }

    @Query(returns => [Unit], {
        description: "Paginated list of units with limit and offset.",
    })
    async unitsByOffset(
        @Args() { first, offset }: PageInput
    ) {

        if (first < 0) {
            throw new Error(`argument: 'first' must not be less than 0. You passed: ${ first } `)
        }
        if (offset < 0) {
            throw new Error(`argument: 'offset' must not be less than 0. You passed: ${ offset } `)
        }

        const balanceData = await getBalanceData()
        const units = balanceData.units.slice(offset, offset + first)

        return units
    }
}
