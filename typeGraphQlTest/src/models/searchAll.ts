import { ObjectType, Field, Int, createUnionType, Float, Resolver, Query, Arg } from "type-graphql"
import getBalanceData, { IBalanceData } from '../balancedata'
import Fuse from 'fuse.js'
import { Building } from "./buildings"
import { Ability } from "./abilities"
import { Weapon } from "./weapons"
import { Upgrade } from "./upgrades"
import { Unit } from "./units"

interface IGenericSearchItem {
    name: string
    type: 'unit' | 'weapon' | 'upgrade' | 'ability' | 'building'
    id: number
    icon: string
    race: string
}

function convertUnitToGenericSearchItem(unit: any): IGenericSearchItem {
    return {
        name: unit.meta.name,
        type: 'unit',
        id: unit.id,
        icon: unit.meta.icon,
        race: unit.meta.race,
    }
}

function convertWeaponToGenericSearchItem(weapon: any): IGenericSearchItem {
    return {
        name: weapon.meta.name,
        type: 'weapon',
        id: weapon.id,
        icon: weapon.meta.icon,
        race: weapon.meta.race,
    }
}

function convertUpgradeToGenericSearchItem(upgrade: any): IGenericSearchItem {
    return {
        name: upgrade.meta.name,
        type: 'upgrade',
        id: upgrade.id,
        icon: upgrade.meta.icon,
        race: upgrade.meta.race,
    }
}

function convertBuildingToGenericSearchItem(building: any): IGenericSearchItem {
    return {
        name: building.meta.name,
        type: 'building',
        id: building.id,
        icon: building.meta.icon,
        race: building.meta.race,
    }
}

function convertAbilityToGenericSearchItem(ability: any): IGenericSearchItem {
    const command = ability.command[0]
    return {
        name: ability.id,
        type: 'ability',
        id: -1, // TODO: ability.id, Type of id field is number so assigning string gets turned into null
        icon: command.meta.icon,
        race: command.meta.race,
    }
}

function convertToGenericSearchList(balanceData: IBalanceData): IGenericSearchItem[] {
    return [
        ...balanceData.units.map(convertUnitToGenericSearchItem),
        ...balanceData.weapons.map(convertWeaponToGenericSearchItem),
        ...balanceData.upgrades.map(convertUpgradeToGenericSearchItem),
        ...balanceData.buildings.map(convertBuildingToGenericSearchItem),
        ...balanceData.abilities.map(convertAbilityToGenericSearchItem),
    ]
}

let list: IGenericSearchItem[] = []
const options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 50,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [
        "name",
    ],
    includeMatches: true as true,
    includeScore: true as true,
}
let fuse = new Fuse(list, options)


@ObjectType("Generic Search item")
export class GenericSearchItem {
    @Field()
    name: string
    @Field(type => Int)
    id: number
    @Field()
    type: string
    @Field()
    icon: string
    @Field()
    race: string
}

@ObjectType("Match Type")
export class MatchType {
    @Field(type => [[Int]])
    indices: number[][]
    @Field()
    key: string
    @Field()
    value: string
}

@ObjectType()
export class SearchItem {
    @Field()
    string: string
    @Field(type => Int)
    index: number
    @Field(type => Int)
    score: number
    @Field(type => SearchResultUnion)
    original: Unit | Building | Weapon | Ability | Upgrade
}

export const SearchResultUnion = createUnionType({
    name: "SearchResult",
    types: () => [Unit, Building, Weapon, Ability, Upgrade] as const,
})

@ObjectType("Search Item")
export class FuseResult {
    @Field()
    item: GenericSearchItem
    @Field(type => [MatchType])
    matches: MatchType[]
    @Field(type => Float)
    score: number
}

@Resolver(of => FuseResult)
export class SearchAllResolver {

    @Query(returns => [FuseResult], {
        description: "Search everything (units, buildings, weapons, and upgrades) by name"
    })
    async searchAll(
        @Arg("query") query: string
    ) {
        // Build Fuse set on first request
        if (list.length === 0) {
            const balanceData = await getBalanceData()
            list = convertToGenericSearchList(balanceData)
            fuse = new Fuse(list, options)
        }

        const fuseResults = fuse.search(query)

        return fuseResults
    }
}
