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
    const [buildings, unitWeapons, otherUnits] = groupIntoBuildingsUnitWeaponsAndOther(nonNeutralUnits)

    const categorizedUnits = { neutralUnits, buildings, unitWeapons, otherUnits }
    console.log({
        buildingsNames: buildings.map(b => b?.attributes?.id),
        unitWeaponsNames: unitWeapons.map(b => b?.attributes?.id),
        neutralUnitsNames: neutralUnits.map(b => b?.attributes?.id),
        otherUnitsNames: otherUnits.map(b => b?.attributes?.id),
    })

    // const units = groupedUnits['units'].map(unit.convertUnitToUnitNode)
    // const buildings = groupedUnits['buildings'].map(unit.convertUnitToUnitNode)

    const buildingUpgrades = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'researches')?.elements ?? [])
    const unitUpgradeContainers = nonNeutralUnits.flatMap(u => u.elements?.find(e => e?.name === 'upgrades')?.elements ?? [])
    const upgradeLevelElements = unitUpgradeContainers.flatMap(u => u.elements?.filter(e => e?.name === 'level') ?? [])
    const uniqueUpgradeLevelElements = [...new Map(upgradeLevelElements.map(u => [u.attributes?.id, u]))]


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
    let unitWeapons: unit.Element[] = []
    let otherUnits: unit.Element[] = []

    for (const unit of nonNeutralUnits) {
        const isWeapon = unit?.attributes?.id?.includes('Weapon') ?? false

        const metaAttributes = unit.elements?.find(a => a.name === 'meta')?.attributes
        const isBuilding = metaAttributes?.icon?.includes('btn-building') ?? false

        if (isBuilding) {
            buildings.push(unit)
        }
        else if (isWeapon) {
            unitWeapons.push(unit)
        }
        else {
            otherUnits.push(unit)
        }
    }
    return [buildings, unitWeapons, otherUnits]
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

