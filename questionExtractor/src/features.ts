import { Feature, FeatureType } from "./model"

/**
 * Creat by looking at properties collected from sc2 balance data and question generated
 * 
 * Pair features with synonyms
 * "cost": ["cost", "amount"]
 * "cost.minerals": ["minerals"],
 * "cost.vespene": ["vespene", "gas"],
 * "weapon.damage": ["damage", "attack"],
 * .........
 */

const exampleUnit = {
    "id": "Colossus",
    "original": {
        "abilities": [
            {
                "id": "stop",
                "command": [
                    {
                        "id": "Stop",
                        "meta": {
                            "name": "Stop",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-command-stop.png"
                        },
                        "misc": null,
                        "cost": null,
                        "effect": null
                    }
                ]
            },
            {
                "id": "attack",
                "command": [
                    {
                        "id": "Execute",
                        "meta": {
                            "name": "Execute",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-command-attack.png"
                        },
                        "misc": null,
                        "cost": null,
                        "effect": null
                    }
                ]
            },
            {
                "id": "move",
                "command": [
                    {
                        "id": "Move",
                        "meta": {
                            "name": "Move",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-command-move.png"
                        },
                        "misc": {
                            "range": 0
                        },
                        "cost": null,
                        "effect": null
                    },
                    {
                        "id": "Patrol",
                        "meta": {
                            "name": "Patrol",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-command-patrol.png"
                        },
                        "misc": {
                            "range": 0
                        },
                        "cost": null,
                        "effect": null
                    },
                    {
                        "id": "HoldPos",
                        "meta": {
                            "name": "Hold Pos",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-command-holdposition.png"
                        },
                        "misc": null,
                        "cost": null,
                        "effect": null
                    }
                ]
            },
            {
                "id": "CliffWalk",
                "command": [
                    {
                        "id": null,
                        "meta": {
                            "name": null,
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-ability-Protoss-cliffwalk-color.png"
                        },
                        "misc": null,
                        "cost": null,
                        "effect": null
                    }
                ]
            }
        ],
        "strengths": [
            {
                "id": "Marine",
                "name": "Marine"
            },
            {
                "id": "Zergling",
                "name": "Zergling"
            },
            {
                "id": "Zealot",
                "name": "Zealot"
            }
        ],
        "weaknesses": [
            {
                "id": "VikingFighter",
                "name": "VikingFighter"
            },
            {
                "id": "Corruptor",
                "name": "Corruptor"
            },
            {
                "id": "Tempest",
                "name": "Tempest"
            }
        ],
        "weapons": [
            {
                "meta": {
                    "name": "Thermal Lances",
                    "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-upgrade-protoss-groundweaponslevel0.png"
                },
                "misc": {
                    "range": 7,
                    "speed": 1.5,
                    "targets": "ground"
                },
                "effect": {
                    "max": 13,
                    "death": "Fire",
                    "radius": -1,
                    "bonus": {
                        "damage": 5,
                        "max": 5,
                        "type": "Light"
                    }
                }
            }
        ],
        "upgrades": [
            {
                "id": "ProtossGroundWeapons",
                "name": "ProtossGroundWeapons",
                "levels": [
                    {
                        "id": "ProtossGroundWeaponsLevel1",
                        "index": 42,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Weapons Level1",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundWeaponsLevel1.png"
                        },
                        "cost": {
                            "minerals": 100,
                            "vespene": 100,
                            "time": 180
                        }
                    },
                    {
                        "id": "ProtossGroundWeaponsLevel2",
                        "index": 43,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Weapons Level2",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundWeaponsLevel2.png"
                        },
                        "cost": {
                            "minerals": 150,
                            "vespene": 150,
                            "time": 215
                        }
                    },
                    {
                        "id": "ProtossGroundWeaponsLevel3",
                        "index": 44,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Weapons Level3",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundWeaponsLevel3.png"
                        },
                        "cost": {
                            "minerals": 200,
                            "vespene": 200,
                            "time": 250
                        }
                    }
                ]
            },
            {
                "id": "ProtossGroundArmors",
                "name": "ProtossGroundArmors",
                "levels": [
                    {
                        "id": "ProtossGroundArmorsLevel1",
                        "index": 45,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Armors Level1",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundArmorLevel1.png"
                        },
                        "cost": {
                            "minerals": 100,
                            "vespene": 100,
                            "time": 180
                        }
                    },
                    {
                        "id": "ProtossGroundArmorsLevel2",
                        "index": 46,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Armors Level2",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundArmorLevel2.png"
                        },
                        "cost": {
                            "minerals": 150,
                            "vespene": 150,
                            "time": 215
                        }
                    },
                    {
                        "id": "ProtossGroundArmorsLevel3",
                        "index": 47,
                        "meta": {
                            "index": null,
                            "name": "Protoss Ground Armors Level3",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-GroundArmorLevel3.png"
                        },
                        "cost": {
                            "minerals": 200,
                            "vespene": 200,
                            "time": 250
                        }
                    }
                ]
            },
            {
                "id": "ProtossShields",
                "name": "ProtossShields",
                "levels": [
                    {
                        "id": "ProtossShieldsLevel1",
                        "index": 48,
                        "meta": {
                            "index": null,
                            "name": "Protoss Shields Level1",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-ShieldsLevel1.png"
                        },
                        "cost": {
                            "minerals": 150,
                            "vespene": 150,
                            "time": 180
                        }
                    },
                    {
                        "id": "ProtossShieldsLevel2",
                        "index": 49,
                        "meta": {
                            "index": null,
                            "name": "Protoss Shields Level2",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-ShieldsLevel2.png"
                        },
                        "cost": {
                            "minerals": 225,
                            "vespene": 225,
                            "time": 215
                        }
                    },
                    {
                        "id": "ProtossShieldsLevel3",
                        "index": 50,
                        "meta": {
                            "index": null,
                            "name": "Protoss Shields Level3",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-ShieldsLevel3.png"
                        },
                        "cost": {
                            "minerals": 300,
                            "vespene": 300,
                            "time": 250
                        }
                    }
                ]
            },
            {
                "id": "ExtendedThermalLance",
                "name": "ExtendedThermalLance",
                "levels": [
                    {
                        "id": null,
                        "index": null,
                        "meta": {
                            "index": null,
                            "name": "ExtendedThermalLance",
                            "icon": "https://sc2iq.blob.core.windows.net/sc2icons/BTN-Upgrade-Protoss-ExtendedThermalLance.png"
                        },
                        "cost": {
                            "minerals": 150,
                            "vespene": 150,
                            "time": 140
                        }
                    }
                ]
            }
        ]
    },
    "meta": {
        "name": "Colossus",
        "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-unit-protoss-colossus.png",
        "race": "protoss"
    },
    "life": {
        "start": 200,
        "max": 200,
        "regenRate": null,
        "delay": null
    },
    "armor": {
        "start": 1,
        "max": 4,
        "regenRate": null,
        "delay": null
    },
    "shieldArmor": {
        "start": 0,
        "max": 3,
        "regenRate": null,
        "delay": null
    },
    "requires": [
        "RoboticsBay"
    ],
    "cost": {
        "minerals": 300,
        "vespene": 200,
        "time": 75,
        "supply": 6
    },
    "movement": {
        "speed": 2.25,
        "acceleration": 1000,
        "deceleration": 0,
        "turnRate": null
    },
    "score": {
        "build": 500,
        "kill": 500
    },
    "misc": {
        "radius": 1,
        "cargoSize": 8,
        "footprint": "",
        "sightRadius": 10,
        "supply": -6,
        "speed": 0,
        "targets": ""
    },
    "producer": "RoboticsFacility",
    "attributes": [
        "Armored",
        "Mechanical",
        "Massive"
    ]
}

const exampleBuilding = {
    "id": "Barracks",
    "index": null,
    "meta": {
        "name": "Barracks",
        "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-building-terran-barracks.png",
        "race": "terran",
        "hotkey": 244,
        "source": "Liberty.SC2Mod",
        "index": 42,
        "tooltip": 245
    },
    "life": {
        "start": 1000,
        "max": 1000,
        "regenRate": null,
        "delay": null
    },
    "armor": {
        "start": 1,
        "max": 3,
        "regenRate": null,
        "delay": null
    },
    "shieldArmor": {
        "start": 0,
        "max": 0,
        "regenRate": null,
        "delay": null
    },
    "requires": [
        "SupplyDepot"
    ],
    "cost": {
        "minerals": 150,
        "vespene": null,
        "time": 65,
        "supply": null
    },
    "movement": null,
    "score": {
        "build": 150,
        "kill": 150
    },
    "misc": {
        "radius": 1.75,
        "cargoSize": 0,
        "footprint": "",
        "sightRadius": 9,
        "supply": 0,
        "speed": 0,
        "targets": ""
    },
    "producer": "SCV",
    "attributes": [
        "Armored",
        "Mechanical",
        "Structure"
    ],
    "weaknesses": [],
    "weapons": [],
    "abilities": [
        "BuildInProgress",
        "que5",
        "Rally",
        "BarracksLiftOff"
    ],
    "trains": [
        "Marine",
        "Reaper",
        "Ghost",
        "Marauder"
    ],
    "researches": []
}

const exampleWeapon = {
    "id": "GuassRifle",
    "index": 27,
    "meta": {
        "name": "Guass Rifle",
        "icon": "https://sc2iq.blob.core.windows.net/sc2icons/btn-upgrade-terran-infantryweaponslevel0.png",
        "race": "terran",
        "hotkey": null,
        "source": null,
        "index": null,
        "tooltip": 0
    },
    "misc": {
        "range": 5,
        "speed": 0.8608,
        "targets": "any"
    },
    "effect": {
        "id": "GuassRifle",
        "index": 490,
        "radius": -1,
        "max": 6,
        "death": "Normal",
        "kind": "Ranged",
        "bonus": null
    }
}

const baseUrl = "https://www.sc2info.com"
const getUnitSource = (id: string) => `${baseUrl}/units/${id}`
const getWeaponSource = (id: string) => `${baseUrl}/weapons/${id}`
const getBuildingSource = (id: string) => `${baseUrl}/buildings/${id}`

const defaultGetAnswer = (value: string | number, o: any) => `The ${o.meta.name} value is ${value}`
export const features: Feature[] = [

    // Generic
    {
        name: 'cost',
        synonyms: ['cost', 'amount'],
        type: FeatureType.Generic,
        getUnitValue: unit => {
            let { minerals, vespene } = unit.cost

            minerals ??= 0
            vespene ??= 0

            return `${minerals} / ${vespene}`
        },
        getUnitAnswer: (cost, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
Unit ${name} costs ${cost}

- Source: ${source}
            `
        },
        getBuildingValue: building => {
            let { minerals, vespene } = building.cost

            minerals ??= 0
            vespene ??= 0

            return `${minerals} / ${vespene}`
        },
        getBuildingAnswer: (cost, building) => {
            const name = building.meta.name
            const source = getBuildingSource(building.id)

            return `
Building ${name} costs ${cost}

- Source: ${source}
            `
        },
        getWeaponValue: x => { throw new Error(`Weapons don't have cost`) },
        getWeaponAnswer: (cost, weapon) => { throw new Error(`Weapons don't have cost`) },
    },
    {
        name: 'cost.minerals',
        synonyms: ['minerals'],
        type: FeatureType.Generic,
        getUnitValue: x => x.cost.minerals ?? 0,
        getUnitAnswer: (cost, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
Unit ${name} costs ${cost} minerals

- Source: ${source}
            `
        },
        getBuildingValue: x => x.cost.minerals ?? 0,
        getBuildingAnswer: (cost, building) => {
            const name = building.meta.name
            const source = getBuildingSource(building.id)

            return `
Building ${name} costs ${cost} minerals

- Source: ${source}
            `
        },
        getWeaponValue: x => { throw new Error(`Weapons don't have cost`) },
        getWeaponAnswer: (cost, weapon) => { throw new Error(`Weapons don't have cost`) },
    },
    {
        name: 'cost.vespene',
        synonyms: ['vespene', 'gas'],
        type: FeatureType.Generic,
        getUnitValue: x => x.cost.vespene ?? 0,
        getUnitAnswer: (cost, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
Unit ${name} costs ${cost} gas

- Source: ${source}
            `
        },
        getBuildingValue: x => x.cost.vespene ?? 0,
        getBuildingAnswer: (cost, building) => {
            const name = building.meta.name
            const source = getBuildingSource(building.id)

            return `
Building ${name} costs ${cost} gas

- Source: ${source}
            `
        },
        getWeaponValue: x => { throw new Error(`Weapons don't have cost`) },
        getWeaponAnswer: defaultGetAnswer,
    },
    {
        name: 'cost.supply',
        synonyms: ['supply'],
        type: FeatureType.Generic,
        getUnitValue: unit => unit.cost.supply,
        getUnitAnswer: (cost, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
Unit ${name} costs ${cost} supply

- Source: ${source}
            `
        },
        getBuildingValue: x => { throw new Error(`Buildings to don't have supply cost`) },
        getBuildingAnswer: defaultGetAnswer,
        getWeaponValue: x => { throw new Error(`Weapons don't have cost`) },
        getWeaponAnswer: defaultGetAnswer,
    },
    {
        name: 'cost.time',
        synonyms: ['time', 'build time'],
        type: FeatureType.Generic,
        getUnitValue: unit => unit.cost.time,
        getUnitAnswer: (cost, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
Unit ${name} takes ${cost} games seconds to build

- Source: ${source}
            `
        },
        getBuildingValue: building => building.cost.time,
        getBuildingAnswer: (cost, building) => {
            const name = building.meta.name
            const source = getBuildingSource(building.id)

            return `
Building ${name} takes ${cost} games seconds to build

- Source: ${source}
            `
        },
        getWeaponValue: x => { throw new Error(`Weapons don't have cost`) },
        getWeaponAnswer: defaultGetAnswer,
    },

    // Unit
    {
        name: 'armor',
        synonyms: ['armor'],
        type: FeatureType.Unit,
        getUnitValue: unit => unit?.armor?.start ?? 0,
        getUnitAnswer: (armor, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has ${armor} armor

- Source: ${source}
            `
        },
    },
    {
        name: 'shields',
        synonyms: ['shields'],
        type: FeatureType.Unit,
        getUnitValue: unit => unit?.shields?.max ?? 0,
        getUnitAnswer: (shields, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has ${shields} shields

- Source: ${source}
            `
        },
    },
    {
        name: 'shieldArmor',
        synonyms: ['shield'],
        type: FeatureType.Unit,
        getUnitValue: unit => unit?.shieldArmor?.start ?? 0,
        getUnitAnswer: (shieldArmor, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has ${shieldArmor} shield armor

- Source: ${source}
            `
        },
    },
    {
        name: 'life',
        synonyms: ['life', 'health', 'hit points'],
        type: FeatureType.Unit,
        getUnitValue: unit => unit.life.max,
        getUnitAnswer: (life, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has ${life} life

- Source: ${source}
            `
        },
    },
    {
        name: 'misc.radius',
        synonyms: ['radius', 'size'],
        type: FeatureType.Unit,
        getUnitValue: x => x.misc.radius,
        getUnitAnswer: (radius, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has as radius ${radius}

- Source: ${source}
            `
        },
    },
    {
        name: 'misc.sightRadius',
        synonyms: ['sight', 'radius', 'range'],
        type: FeatureType.Unit,
        getUnitValue: x => x.misc.sightRadius,
        getUnitAnswer: (sightRadius, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has as sight radius ${sightRadius}

- Source: ${source}
            `
        },
    },
    {
        name: 'movement.speed',
        synonyms: ['movement', 'speed'],
        type: FeatureType.Unit,
        getUnitValue: x => x.movement.speed,
        getUnitAnswer: (movementSpeed, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has movement speed ${movementSpeed}

- Source: ${source}
            `
        },
    },
    {
        name: 'movement.acceleration',
        synonyms: ['acceleration'],
        type: FeatureType.Unit,
        getUnitValue: x => x.movement.acceleration,
        getUnitAnswer: (movementAccelerated, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
${name} has movement acceleration ${movementAccelerated}

- Source: ${source}
            `
        },
    },

    {
        name: 'strengths',
        synonyms: ['strengths', 'strong', 'against'],
        type: FeatureType.Unit,
        getUnitValue: x => x.original.strengths.map((x: any) => x.name).join(', '),
        getUnitAnswer: (strengths, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
    ${name} is strong against ${strengths}
    
    - Source: ${source}
                `
        },
    },

    {
        name: 'weaknesses',
        synonyms: ['weakness', 'enemies', 'counters'],
        type: FeatureType.Unit,
        getUnitValue: x => x.original.weaknesses.map((x: any) => x.name).join(', '),
        getUnitAnswer: (weaknesses, unit) => {
            const name = unit.meta.name
            const source = getUnitSource(unit.id)

            return `
    ${name} is weak against ${weaknesses}
    
    - Source: ${source}
                `
        },
    },

    {
        name: 'command.cooldown',
        synonyms: ['cooldown'],
        type: FeatureType.Command,
        getCommandValue: x => x,
        getCommandAnswer: defaultGetAnswer,
    },
    {
        name: 'command.energy',
        synonyms: ['energy'],
        type: FeatureType.Command,
        getCommandValue: x => x.energy,
        getCommandAnswer: defaultGetAnswer,
    },
    {
        name: 'command.duration',
        synonyms: ['duration'],
        type: FeatureType.Command,
        getCommandValue: x => x.duration,
        getCommandAnswer: defaultGetAnswer,
    },
    {
        name: 'command.effect.radius',
        synonyms: ['effect', 'radius'],
        type: FeatureType.Command,
        getCommandValue: x => x.effect.radius,
        getCommandAnswer: defaultGetAnswer,
    },
    {
        name: 'command.misc.range',
        synonyms: ['range'],
        type: FeatureType.Command,
        getCommandValue: x => x.misc.range,
        getCommandAnswer: defaultGetAnswer,
    },

    // Building
    // None (All generic properties?)

    // Weapon
    {
        name: 'weapon.damage',
        synonyms: ['damage', 'attack'],
        type: FeatureType.Weapon,
        getWeaponValue: x => x.effect.max,
        getWeaponAnswer: (damage, weapon) => {
            let answer = `The damage of ${weapon.meta.name} is ${damage}`

            if (weapon.effect?.bonus) {
                const { type, damage } = weapon.effect.bonus
                answer += ` (Bonus: + ${damage} vs ${type})`
            }

            if (weapon?.id) {
                const source = getWeaponSource(weapon.id)

                return `
${answer}

- Source: ${source}
                `
            }

            return answer
        },
    },

    // weapon.misc.speed
]

export default features