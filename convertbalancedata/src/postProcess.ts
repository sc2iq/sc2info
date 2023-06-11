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


export function postProcess(parsedUnits: Units) {
    return parsedUnits
}

// export function postProcess(parsedUnits: Units): ICategorizedUnits {
//     const genericUnits = parsedUnits.unit
//         .map(parsedUnit => unit.convertUnit(parsedUnit))

//     const nonNeutralUnits = genericUnits
//         .filter(unit => unit.meta.race !== 'neutral')
//         .filter(unit => !unit.meta.icon || !unit.meta.icon.includes('btn-missing-kaeo'))

//     const groupedUnits = _.groupBy(nonNeutralUnits, unit => {
//         if (
//             (Array.isArray(unit.attributes) && unit.attributes.some(attribute => attribute.type === 'Structure')) ||
//             (unit.meta.icon && unit.meta.icon.includes('btn-building'))
//         ) {
//             return 'buildings'
//         } else if (unit.meta.name.includes('Weapon')) {
//             return 'unitWeapons'
//         }

//         return 'units'
//     })

//     const rawUnits = groupedUnits['units']
//     const units = groupedUnits['units'].map(unit.convertUnitToUnitNode)
//     const unitWeapons = groupedUnits['unitWeapons']
//     const buildings = groupedUnits['buildings'].map(unit.convertUnitToUnitNode)
//     const weapons = _.uniqBy(
//         _.flatMap(nonNeutralUnits, x => x.weapons.map(addRaceToWeaponMeta(x.meta.race))),
//         x => x.id
//     )
//     const buildingUpgrades = _.uniqBy(
//         _.flatMap(nonNeutralUnits, x => x.researches.map(addRaceToUpgradeMeta(x.meta.race))),
//         x => x.id
//     )

//     const upgrades1 = _.flatMap(nonNeutralUnits, x => x.upgrades)
//     const upgrades = _.flatMap(upgrades1, x => x.levels)
//     const uniqueUpgrades =  _.uniqBy(upgrades, x => x.id)

//     const abilities = _.uniqBy(
//         _.flatMap(nonNeutralUnits, x => x.abilities.map(addRaceToAbilityMeta(x.meta.race))),
//         x => x.id
//     ).filter(x => x.command.some(command => !command.meta.icon.includes('btn-missing-kaeo')))
//     const attributes = _.uniqBy(_.flatMap(nonNeutralUnits, x => x.attributes.map(a => a.type)), x => x)

//     const categorizedUnits: ICategorizedUnits = {
//         rawUnits,
//         units,
//         unitWeapons,
//         buildings,
//         weapons,
//         upgrades: uniqueUpgrades,
//         buildingUpgrades,
//         abilities,
//         attributes,
//     }

//     return categorizedUnits
// }
