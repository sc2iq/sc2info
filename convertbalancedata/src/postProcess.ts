import * as unit from './unit'
import * as _ from 'lodash'

export interface ICategorizedUnits {
    rawUnits: unit.IUnit[]
    units: unit.IUnitNode[]
    unitWeapons: unit.IUnit[]
    buildings: unit.IUnitNode[]
    weapons: unit.IWeapon[]
    upgrades: unit.IUpgradeLevel[]
    buildingUpgrades: unit.IBuildingUpgrade[]
    abilities: unit.IAbility[]
    attributes: string[]
}

function addRaceToWeaponMeta(race: string) {
    return (x: unit.IWeapon) => {
        if (x.meta.icon.includes('protoss')) {
            x.meta.race = 'protoss'
        } else if (x.meta.icon.includes('zerg')) {
            x.meta.race = 'zerg'
        } else if (x.meta.icon.includes('terran')) {
            x.meta.race = 'terran'
        } else {
            x.meta.race = race
        }

        return x
    }
}

function addRaceToUpgradeMeta(race: string) {
    return (x: unit.IBuildingUpgrade) => {
        x.meta.race = race
        return x
    }
}

function addRaceToAbilityMeta(race: string) {
    return (x: unit.IAbility) => {
        x.command.forEach(command => (command.meta.race = race))
        return x
    }
}

export interface Units {
    unit: unit.IParsedUnit[]
}

export function categorizeUnits(rawXmlAsJson: unit.RootElement): ICategorizedUnits {
    const unitElements = rawXmlAsJson.elements
        .find(e => e.name === 'units')
        ?.elements ?? []

    // const genericUnits = parsedUnits.unit
    //     .map(parsedUnit => unit.convertUnit(parsedUnit))

    const [nonNeutralUnits, neutralUnits] = groupIntoNeutralAndNonNeutral(unitElements)

    const [buildings, other] = nonNeutralUnits
        .reduce<[unit.Element[],unit.Element[]]>(([buildingsArray, otherArray], u) => {
            const attributeElements = u.elements?.find(e => e?.name === 'attributes')?.elements ?? []
            const isStructure = attributeElements?.some(e => e?.attributes?.type == 'Structure')
            
            if (isStructure) {
                buildingsArray.push(u)
            }
            else {
                otherArray.push(u)
            }

            return [buildingsArray, otherArray]
        }, [[],[]])
    
    // const units = groupedUnits['units'].map(unit.convertUnitToUnitNode)
    // const buildings = groupedUnits['buildings'].map(unit.convertUnitToUnitNode)

    const unitWeaponsElements = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'weapons')?.elements ?? [])
    const uniqueUnitWeaponsMap = new Map(unitWeaponsElements.map(u => [u.attributes?.id, u]))
    uniqueUnitWeaponsMap.delete(undefined)
    const uniqueUniqueUnitWeapons = [...uniqueUnitWeaponsMap.values()]

    const buildingUpgradesElements = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'researches')?.elements ?? [])
    const buildingUpgradesMap = new Map(buildingUpgradesElements.map(u => [u.attributes?.id, u]))

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

    const abilities = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'abilities')?.elements ?? [])

    const attributes = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'attributes')?.elements ?? [])
    const uniqueAttributes = [...(new Set(attributes.map(u => u.attributes?.type)))]

    // const abilities = _.uniqBy(
    //     _.flatMap(nonNeutralUnits, x => x.abilities.map(addRaceToAbilityMeta(x.meta.race))),
    //     x => x.id
    // ).filter(x => x.command.some(command => !command.meta.icon.includes('btn-missing-kaeo')))
    // const attributes = _.uniqBy(_.flatMap(nonNeutralUnits, x => x.attributes.map(a => a.type)), x => x)

    // const categorizedUnits: ICategorizedUnits = {
    //     rawUnits,
    //     units,
    //     unitWeapons,
    //     buildings,
    //     weapons,
    //     upgrades: uniqueUpgrades,
    //     buildingUpgrades,
    //     abilities,
    //     attributes,
    // }

    const categorizedUnits = {
        neutralUnits,
        buildings,
        buildingUpgrades,
        unitWeapons: uniqueUniqueUnitWeapons,
        upgrades: uniqueUpgradeLevelElements,
        abilities,
        attributes: uniqueAttributes,
        other,
    }

    console.log({
        neutralUnitsNames: categorizedUnits.neutralUnits.map(b => b?.attributes?.id),
        buildingsNames: categorizedUnits.buildings.map(b => b?.attributes?.id),
        buildingUpgradeNames: categorizedUnits.buildingUpgrades.map(b => b?.attributes?.id),
        unitWeaponsNames: categorizedUnits.unitWeapons.map(b => b?.attributes?.id),
        upgradeNames: categorizedUnits.upgrades.map(b => b?.attributes?.id).sort((a,b) => a?.localeCompare(b ?? '') ?? 0),
        abilitiesNames: categorizedUnits.abilities.map(b => b?.attributes?.id),
        attributesNames: categorizedUnits.attributes.sort((a,b) => a?.localeCompare(b ?? '') ?? 0),
    })

    return categorizedUnits as any
}

function getElementsOfUnitContainingName(units: unit.Element[], elementName: string): unit.Element[] {
    const selectedUnits: unit.Element[] = []
    for (const unit of units) {
        const unitElementsOfName = unit.elements?.find(e => e?.name === elementName)?.elements ?? []
        const doesUnitHaveElementOfName = unitElementsOfName.length > 0
        if (doesUnitHaveElementOfName) {
            selectedUnits.push(...unitElementsOfName)
        }
    }

    return selectedUnits
}

function groupIntoBuildingsUnitWeaponsAndOther(nonNeutralUnits: unit.Element[]): unit.Element[][] {
    let buildings: unit.Element[] = []
    let otherUnits: unit.Element[] = []

    for (const unit of nonNeutralUnits) {

        const metaAttributes = unit.elements?.find(a => a.name === 'meta')?.attributes
        const isBuilding = metaAttributes?.icon?.includes('btn-building') ?? false

        if (isBuilding) {
            buildings.push(unit)
        }
        else {
            otherUnits.push(unit)
        }
    }
    return [buildings, otherUnits]
}

function groupIntoNeutralAndNonNeutral(unitElements: unit.Element[]): unit.Element[][] {
    let neutralUnits: unit.Element[] = []
    let nonNeutralUnits: unit.Element[] = []

    for (const unit of unitElements) {
        const metaAttributes = unit.elements?.find(a => a.name === 'meta')?.attributes
        const isNeutral = metaAttributes?.race?.toLowerCase().includes('neut') ?? false
        const isMissingIcon = metaAttributes?.icon?.includes('btn-missing-kaeo') ?? false

        if (isNeutral || isMissingIcon) {
            neutralUnits.push(unit)
        }
        else {
            nonNeutralUnits.push(unit)
        }
    }

    return [nonNeutralUnits, neutralUnits]
}

