import getBalanceData, { IBalanceData } from '../../balancedata'
import Fuse from 'fuse.js'

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

const Unit = {
    __resolveType(obj: any, context: any, info: any) {
        console.log(`Resolve Type: `, { obj, context, info })
        if (obj.meta.name) {
            return 'Unit'
        }

        return null
    },
}

const Building = {
    __resolveType(obj: any, context: any, info: any) {
        console.log(`Resolve Type: `, { obj, context, info })
        if (obj.meta.name) {
            return 'Building'
        }

        return null
    },
}

const Weapon = {
    __resolveType(obj: any, context: any, info: any) {
        console.log(`Resolve Type: `, { obj, context, info })
        if (obj.meta.name) {
            return 'Weapon'
        }

        return null
    },
}

const Ability = {
    __resolveType(obj: any, context: any, info: any) {
        console.log(`Resolve Type: `, { obj, context, info })
        if (obj.meta.name) {
            return 'Ability'
        }

        return null
    },
}

const Upgrade = {
    __resolveType(obj: any, context: any, info: any) {
        console.log(`Resolve Type: `, { obj, context, info })
        if (obj.meta.name) {
            return 'Upgrade'
        }

        return null
    },
}

const SearchResult = {
    __resolveType(obj: IGenericSearchItem) {
        switch (obj.type) {
            case "unit": {
                return "Unit"
            }
            case "weapon": {
                return "Weapon"
            }
            case "upgrade": {
                return "Upgrade"
            }
            case "ability": {
                return "Ability"
            }
            case "building": {
                return "Building"
            }
        }

        return null
    },
}

const Query = {
    searchAll: async (_: any, { query }: { query: string }) => {
        // Build Fuse set on first request
        if (list.length === 0) {
            const balanceData = await getBalanceData()
            list = convertToGenericSearchList(balanceData)
            fuse = new Fuse(list, options)
        }

        const fuseResults = fuse.search(query)

        return fuseResults
    },
}

const Mutation = {
}

export default {
    Unit,
    Building,
    Weapon,
    Ability,
    Upgrade,
    SearchResult,

    Query,
    Mutation,
}