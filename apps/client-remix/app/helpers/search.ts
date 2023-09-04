import Fuse from 'fuse.js'
import { XmlJsonElement } from '~/utilities'
import { getNameIconRace } from '.'

export interface IGenericSearchItem {
    name: string
    type: 'unit' | 'weapon' | 'upgrade' | 'ability' | 'building'
    id: number
    icon: string
    race: string
}

function convertUnitToGenericSearchItem(unit: XmlJsonElement): IGenericSearchItem {
    const genericItemData = getNameIconRace(unit)
    return {
        ...genericItemData,
        type: 'unit',
    }
}

function convertWeaponToGenericSearchItem(weapon: XmlJsonElement): IGenericSearchItem {
    const genericItemData = getNameIconRace(weapon)
    return {
        ...genericItemData,
        type: 'weapon',
    }
}

function convertUpgradeToGenericSearchItem(upgrade: XmlJsonElement): IGenericSearchItem {
    const genericItemData = getNameIconRace(upgrade)
    return {
        ...genericItemData,
        type: 'upgrade',
    }
}

function convertBuildingToGenericSearchItem(building: XmlJsonElement): IGenericSearchItem {
    const genericItemData = getNameIconRace(building)
    return {
        ...genericItemData,
        type: 'building',
    }
}

function convertAbilityToGenericSearchItem(ability: XmlJsonElement): IGenericSearchItem {
    const abilityMetaAttributes = ability
        .elements?.find(e => e?.name === "command")
        ?.elements?.find(e => e?.name === "meta")
        ?.attributes ?? {}

    return {
        name: ability.attributes?.id ?? '',
        type: 'ability',
        id: -1, // TODO: ability.id, Type of id field is number so assigning string gets turned into null
        icon: abilityMetaAttributes.icon,
        race: abilityMetaAttributes.race,
    }
}

function convertToGenericSearchItems(balanceData: Record<string, XmlJsonElement[]>): IGenericSearchItem[] {
    return [
        ...balanceData.unitsWithWeapons.map(convertUnitToGenericSearchItem),
        ...balanceData.unitWeapons.map(convertWeaponToGenericSearchItem),
        ...balanceData.upgrades.map(convertUpgradeToGenericSearchItem),
        ...balanceData.buildings.map(convertBuildingToGenericSearchItem),
        ...balanceData.abilities.map(convertAbilityToGenericSearchItem),
    ]
}

export function getFuseObject(balanceData: Record<string, XmlJsonElement[]>) {
    const searchItems = convertToGenericSearchItems(balanceData)
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
    const fuse = new Fuse(searchItems, options)

    return fuse
}
