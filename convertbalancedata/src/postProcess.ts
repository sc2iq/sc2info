import * as unit from './unit'

export function categorizeUnits(rawXmlAsJson: unit.RootElement) {
    const unitElements = rawXmlAsJson.elements
        .find(e => e.name === 'units')
        ?.elements ?? []

    unitElements.forEach(unitElement => {
        const metaAttributes = unitElement.elements?.find(a => a.name === 'meta')?.attributes ?? {}
        if (typeof metaAttributes?.race != 'string') {
            unitElement.attributes ??= {}
            
            const iconName = metaAttributes?.icon ?? ''
            if (iconName.toLowerCase().includes('protoss')) {
                unitElement.attributes.race = 'protoss'
            }
            else if (iconName.toLowerCase().includes('zerg')) {
                unitElement.attributes.race = 'zerg'
            }
            else if (iconName.toLowerCase().includes('terran')) {
                unitElement.attributes.race = 'terran'
            }
            else {
                unitElement.attributes.race = 'neural'
            }
        }
    })

    const unitGroups = groupBy(unitElements, groupIntoNeutralAndNonNeutral)
    const nonNeutralUnits = unitGroups['nonNeutral']
    const neutralUnits = unitGroups['neutral']

    const structureGroups = groupBy(nonNeutralUnits, isUnitAStructure)
    const buildings = structureGroups['structures']
    const nonStructureElements = structureGroups['nonStructures']

    const hasWeaponsGroups = groupBy(nonStructureElements, hasWeapons)
    const unitsWithWeapons = hasWeaponsGroups['hasWeapons']
    const unitsWithoutWeapons = hasWeaponsGroups['doesNotHaveWeapons']

    // Get unit weapons
    const unitWeaponsElements = unitsWithWeapons.flatMap(u => u.elements?.find(e => e?.name === 'weapons')?.elements ?? [])
    const uniqueUnitWeaponsMap = new Map(unitWeaponsElements.map(u => [u.attributes?.id, u]))
    uniqueUnitWeaponsMap.delete(undefined)
    const uniqueUniqueUnitWeapons = [...uniqueUnitWeaponsMap.values()]
    
    // Get building upgrades
    const buildingUpgradesElements = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'researches')?.elements ?? [])
    const buildingUpgradesMap = new Map(buildingUpgradesElements.map(u => [u.attributes?.id, u]))

    // Get unit upgrades
    const upgradeLevelElements = nonNeutralUnits
        .flatMap(u => u.elements?.find(e => e?.name === 'upgrades')?.elements ?? [])
        .flatMap(u => u.elements?.filter(e => e?.name === 'level') ?? [])
    const upgradeLevelsMap = new Map(upgradeLevelElements.map(u => [u.attributes?.id, u]))
    upgradeLevelsMap.delete(undefined)

    upgradeLevelsMap.forEach((_, key) => {
        buildingUpgradesMap.delete(key)
    })

    const buildingUpgrades = [...buildingUpgradesMap.values()]

    const uniqueUpgradeLevelElements = [...upgradeLevelsMap.values()]

    const abilities = nonNeutralUnits.flatMap(a => a.elements?.find(e => e?.name === 'abilities')?.elements ?? [])
    const uniqueAbilitiesMap = new Map(abilities.map(a => [a.attributes?.id, a]))
    uniqueAbilitiesMap.delete(undefined)
    const uniqueUniqueAbilities = [...uniqueAbilitiesMap.values()]

    const attributes = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'attributes')?.elements ?? [])
    const uniqueAttributes = [...(new Set(attributes.map(u => u.attributes?.type)))]

    const categorizedUnits = {
        neutralUnits,
        buildings,
        buildingUpgrades,
        unitsWithWeapons,
        unitWeapons: uniqueUniqueUnitWeapons,
        upgrades: uniqueUpgradeLevelElements,
        abilities: uniqueUniqueAbilities,
        attributes: uniqueAttributes,
        nonStructureElements,
    }

    return categorizedUnits as any
}

function isUnitAStructure(unit: unit.Element) {
    const attributeElements = unit.elements?.find(e => e?.name === 'attributes')?.elements ?? []
    const isStructure = attributeElements?.some(e => e?.attributes?.type == 'Structure')

    return isStructure ? 'structures' : 'nonStructures'
}

function hasWeapons(unit: unit.Element) {
    const hasWeapons = unit.elements?.some(e => e?.name === 'weapons')

    return hasWeapons ? 'hasWeapons' : 'doesNotHaveWeapons'
}

function groupIntoNeutralAndNonNeutral(unitElement: unit.Element) {
    const metaAttributes = unitElement.elements?.find(a => a.name === 'meta')?.attributes
    const isNeutral = metaAttributes?.race?.toLowerCase().includes('neut') ?? false
    const isMissingIcon = metaAttributes?.icon?.includes('btn-missing-kaeo') ?? false

    if (isNeutral || isMissingIcon) {
        return 'neutral'
    }
    else {
        return 'nonNeutral'
    }
}

function groupBy<T>(xs: T[], groupFn: (x: T) => string): Record<string, T[]> {
    let groups: Record<string, T[]> = {}

    for (const x of xs) {
        const group = groupFn(x)

        groups[group] ??= []
        groups[group].push(x)
    }

    return groups
}
