import * as _ from 'lodash'
import * as utils from './utilities'

export type RootElement = {
    elements: Element[]
}

export type Element = {
    name: string
    type: string
    attributes?: Record<string, string>
    elements?: Element[]
}

export interface IEntity {
    id: string
}

export interface IUnitReference extends IEntity {
    name: string
}

export interface IParsedUnit extends IEntity {
    meta: IParsedMeta
    life: IParsedHealth
    armor: IParsedHealth
    shields: IParsedHealth
    shieldArmor: IParsedHealth
    requires: IParsedRequires
    cost: IParsedCost
    movement: IParsedMovement
    score: IParsedScore
    misc: IParsedMisc
    producer: IUnitReference
    attributes: IParsedAttributes
    strengths: IParsedStrengths
    weaknesses: IParsedWeaknesses
    weapons: IParsedWeapons
    abilities: IParsedAbilities
    builds: IParsedBuilds
    trains: IParsedTrains
    upgrades: IParsedUpgrades
    researches: IParsedBuildingUpgrades
}

export interface IUnit extends IEntity {
    abilities: IAbility[]
    armor: IHealth
    attributes: IAttribute[]
    builds: IUnit[]
    cost: ICost
    life: IHealth
    meta: IMeta
    misc: IMisc
    movement: IMovement
    producer: IUnitReference
    requires: IUnitReference[]
    researches: IBuildingUpgrade[]
    score: IScore
    shields: IHealth
    shieldArmor: IHealth
    strengths: IUnitReference[]
    trains: IUnit[]
    upgrades: IUpgrade[]
    weaknesses: IUnitReference[]
    weapons: IWeapon[]
}

export interface IUnitNode extends IEntity {
    original: IUnit
    abilities: string[]
    armor: IHealth
    attributes: string[]
    builds: string[]
    cost: ICost
    life: IHealth
    meta: IMeta
    misc: IMisc
    movement: IMovement
    producer: string
    requires: string[]
    researches: string[]
    score: IScore
    shields?: IHealth
    shieldArmor: IHealth
    strengths: string[]
    trains: string[]
    upgrades: string[]
    weaknesses: string[]
    weapons: string[]
}

export function convertUnit(parsedUnit: IParsedUnit): IUnit {
    const id = parsedUnit.id
    const meta = parsedUnit.meta && convertMeta(parsedUnit.meta)
    meta.name = parsedUnit.id && utils.convertCamelCaseToSpacedCase(parsedUnit.id)

    let requires: any[] = []
    if (parsedUnit.requires) {
        if (parsedUnit.requires.unit) {
            requires = requires.concat(convertOneOrMore(parsedUnit.requires.unit).map(convertUnitReference))
        }
        if (parsedUnit.requires.upgrade) {
            requires = requires.concat(convertOneOrMore(parsedUnit.requires.upgrade).map(convertUnitReference))
        }
    }

    const life = parsedUnit.life && convertHealth(parsedUnit.life)

    const defaultHealth = {
        start: 0,
        max: 0,
        regenRate: 0,
        delay: 0,
    }

    const shields = parsedUnit.shields
        ? convertHealth(parsedUnit.shields)
        : defaultHealth

    const armor = parsedUnit.armor && convertHealth(parsedUnit.armor)
    const shieldArmor = parsedUnit.shieldArmor && convertHealth(parsedUnit.shieldArmor)
    const cost = parsedUnit.cost && convertCost(parsedUnit.cost)
    const movement = parsedUnit.movement && convertMovement(parsedUnit.movement)
    const score = parsedUnit.score && convertScore(parsedUnit.score)
    const misc = parsedUnit.misc && convertMisc(parsedUnit.misc)

    const defaultUnitReference = {
        id: 'DefaultUnitReferenceId',
        name: 'DefaultUnitReferenceName',
    }
    const producer = parsedUnit.producer
        ? convertUnitReference(parsedUnit.producer)
        : defaultUnitReference

    const attributes = parsedUnit.attributes ? convertOneOrMore(parsedUnit.attributes.attribute) : []
    const strengths = parsedUnit.strengths ? convertOneOrMore(parsedUnit.strengths.unit).map(convertUnitReference) : []
    const weaknesses = parsedUnit.weaknesses
        ? convertOneOrMore(parsedUnit.weaknesses.unit).map(convertUnitReference)
        : []
    const weapons = parsedUnit.weapons
        ? convertOneOrMore(parsedUnit.weapons.weapon).map(weapon => convertWeapon(weapon, id))
        : []
    const abilities = parsedUnit.abilities ? convertOneOrMore(parsedUnit.abilities.ability).map(convertAbility) : []
    const builds = parsedUnit.builds ? convertOneOrMore(parsedUnit.builds.unit).map(convertUnit) : []
    const trains = parsedUnit.trains ? convertOneOrMore(parsedUnit.trains.unit).map(convertUnit) : []
    const upgrades = parsedUnit.upgrades ? convertOneOrMore(parsedUnit.upgrades.upgrade).map(convertUpgrade) : []
    const researches = parsedUnit.researches
        ? convertOneOrMore(parsedUnit.researches.upgrade).map(convertBuildingUpgrade)
        : []

    const unit = {
        id,
        meta,
        life,
        shields,
        armor,
        shieldArmor,
        cost,
        movement,
        score,
        misc,
        producer,
        attributes,
        requires,
        strengths,
        weaknesses,
        weapons,
        abilities,
        builds,
        trains,
        upgrades,
        researches,
    }

    return unit
}

export function convertUnitToUnitNode(unit: IUnit): IUnitNode {
    return {
        original: unit,
        ...unit,
        requires: unit.requires.map(unitRef => unitRef.id),
        producer: unit.producer.id,
        attributes: unit.attributes.map(a => a.type),
        strengths: unit.strengths.map(s => s.id),
        weaknesses: unit.weaknesses.map(s => s.id),
        abilities: unit.abilities.map(a => a.id),
        builds: unit.builds.map(b => b.id),
        weapons: unit.weapons.map(w => w.id),
        trains: unit.trains.map(t => t.id),
        upgrades: unit.upgrades.map(u => u.id),
        researches: unit.researches.map(r => r.id),
    }
}

export const RaceMap: { [key: string]: string } = {
    Zerg: 'zerg',
    Prot: 'protoss',
    Terr: 'terran',
    Neut: 'neutral',
}

export interface IParsedMeta {
    name: string
    icon: string
    race: string
    hotkey: string
    source: string
    index: string
    tooltip: string
}

export interface IMeta {
    name: string
    icon: string
    race: string
    hotkey: number
    source: string
    index: number
    tooltip: number
}

export function convertMeta(parsedMeta: IParsedMeta): IMeta {
    return {
        ...parsedMeta,
        race: RaceMap[parsedMeta.race],
        hotkey: parseInt(parsedMeta.hotkey),
        icon: `https://sc2iq.blob.core.windows.net/sc2icons/${parsedMeta.icon}.png`,
        index: parseInt(parsedMeta.index),
        tooltip: parseInt(parsedMeta.tooltip),
    }
}

export interface IParsedHealth {
    start: string
    max: string
    regenRate: string
    delay: string
}

export interface IHealth {
    start: number
    max: number
    regenRate: number
    delay: number
}

export function convertHealth(parsedHealth: IParsedHealth): IHealth {
    return {
        start: parseInt(parsedHealth.start),
        max: parseInt(parsedHealth.max),
        regenRate: parseInt(parsedHealth.regenRate),
        delay: parseInt(parsedHealth.delay),
    }
}

export interface IParsedCost {
    minerals: string
    vespene: string
    time: string
    supply: string
}

export interface ICost {
    minerals: number
    vespene: number
    time: number
    supply: number
}

export function convertCost(parsedCost: IParsedCost): ICost {
    return {
        minerals: parseInt(parsedCost.minerals),
        vespene: parseInt(parsedCost.vespene),
        time: parseInt(parsedCost.time),
        supply: parseInt(parsedCost.supply),
    }
}

export interface IParsedMovement {
    speed: string
    acceleration: string
    deceleration: string
    turnRate: string
}

export interface IMovement {
    speed: number
    acceleration: number
    deceleration: number
    turnRate: number
}

export function convertMovement(parsedMovement: IParsedMovement): IMovement {
    return {
        speed: parseFloat(parsedMovement.speed),
        acceleration: parseFloat(parsedMovement.acceleration),
        deceleration: parseFloat(parsedMovement.deceleration),
        turnRate: parseFloat(parsedMovement.turnRate),
    }
}

export interface IParsedScore {
    build: string
    kill: string
}

export interface IScore {
    build: number
    kill: number
}

export function convertScore(parsedScore: IParsedScore): IScore {
    return {
        build: parseInt(parsedScore.build),
        kill: parseInt(parsedScore.kill),
    }
}

export interface IParsedMisc {
    radius: string
    cargoSize: string
    footprint: string
    sightRadius: string
    supply: string
    speed: number
    targets: string
}

export interface IMisc {
    radius: number
    cargoSize: number
    footprint: string
    sightRadius: number
    supply: number
    speed: number
    targets: string
}

const parseFloatNullable = (x: null | undefined | string, fallback = -1): number => {
    if (!x) {
        return fallback
    }

    return parseFloat(x)
}

const parseIntNullable = (x: null | undefined | string, fallback = -1): number => {
    if (!x) {
        return fallback
    }

    return parseInt(x, 10)
}

export function convertMisc(parsedMisc: IParsedMisc): IMisc {
    return {
        footprint: '',
        speed: 0,
        targets: '',
        radius: parseFloatNullable(parsedMisc.radius),
        cargoSize: parseIntNullable(parsedMisc.cargoSize),
        sightRadius: parseIntNullable(parsedMisc.sightRadius),
        supply: parseIntNullable(parsedMisc.supply),
    }
}

export interface IParsedAttributes {
    attribute: IAttribute | IAttribute[]
}

export interface IAttribute {
    type: string
}

export interface IParsedStrengths {
    unit: IUnitReference[]
}

export interface IParsedRequires {
    unit?: IUnitReference | IUnitReference[]
    upgrade?: IUnitReference | IUnitReference[]
}

export interface IParsedBuilds {
    unit: IParsedUnit[]
}

export interface IParsedTrains {
    unit: IParsedUnit[]
}

export function convertUnitReference(parsedUnitReference: IUnitReference): IUnitReference {
    // Note: Raw JSON has this backwards, change is intentional
    return {
        id: parsedUnitReference.id,
        name: parsedUnitReference.id,
    }
}

export function convertOneOrMore<T>(parsedInput: T | T[]): T[] {
    return Array.isArray(parsedInput) ? parsedInput : [parsedInput]
}

export interface IParsedWeaknesses {
    unit: IUnitReference[]
}

export interface IParsedWeapons {
    weapon: IParsedWeapon[]
}

export interface IParsedWeapon extends IEntity {
    id: string
    index: string
    meta: IParsedMeta
    misc: IParsedWeaponMisc
    effect: IParsedEffect
}

export interface IWeapon extends IEntity {
    unitId: string
    index: number
    meta: IMeta
    misc: IWeaponMisc
    effect: IEffect
}

export function convertWeapon(parsedWeapon: IParsedWeapon, unitId: string): IWeapon {
    const id = parsedWeapon.id
    const meta = parsedWeapon.meta && convertMeta(parsedWeapon.meta)
    meta.name = parsedWeapon.id && utils.convertCamelCaseToSpacedCase(parsedWeapon.id)

    return {
        unitId,
        id,
        index: parseInt(parsedWeapon.index || ''),
        meta,
        misc: parsedWeapon.misc && convertWeaponMisc(parsedWeapon.misc),
        effect: parsedWeapon.effect && convertEffect(parsedWeapon.effect),
    }
}

export interface IParsedWeaponMisc {
    range: string
    speed: string
    targets: string
}

export interface IWeaponMisc {
    range: number
    speed: number
    targets: string
}

export function convertWeaponMisc(parsedWeaponMisc: IParsedWeaponMisc): IWeaponMisc {
    return {
        range: parseInt(parsedWeaponMisc.range),
        speed: parseFloat(parsedWeaponMisc.speed),
        targets: parsedWeaponMisc.targets,
    }
}

export interface IParsedEffect extends IEntity {
    index: string
    radius: string
    damage: string
    max: string
    death: string
    kind: string
    bonus: IParsedBonus
}

export interface IEffect extends IEntity {
    index: number
    radius: number
    max: number
    death: string
    kind: string
    bonus: IBonus
}

export function convertEffect(parsedEffect: IParsedEffect): IEffect {
    return {
        id: parsedEffect.id,
        index: parseInt(parsedEffect.index),
        radius: parseFloat(parsedEffect.radius),
        max: parseIntNullable(parsedEffect.max),
        death: parsedEffect.death,
        kind: parsedEffect.kind,
        bonus: parsedEffect.bonus && convertBonus(parsedEffect.bonus),
    }
}

export interface IParsedBonus {
    damage: string
    max: string
    type: string
}

export interface IBonus {
    damage: number
    max: number
    type: string
}

export function convertBonus(parsedBonus: IParsedBonus): IBonus {
    return {
        damage: parseInt(parsedBonus.damage),
        max: parseInt(parsedBonus.max),
        type: parsedBonus.type,
    }
}

export interface IParsedAbilities {
    ability: IParsedAbility[]
}

export interface IParsedAbility extends IEntity {
    index: string
    command: IParsedCommand | IParsedCommand[]
}

export interface IParsedCommand extends IEntity {
    index: string
    meta: IParsedMeta
    misc: IParsedCommandMisc
    cost: IParsedCommandCost
    effect: IParsedCommandEffect
}

export interface IParsedCommandMisc {
    range: string
}

export interface IParsedCommandCost {
    energy: string
    cooldown: string
    time: string
}

export interface IParsedCommandEffect {
    id: string
    index: string
    radius: string
}

export interface IAbility extends IEntity {
    index: number
    command: ICommand[]
}

export interface ICommandMisc {
    range: number
}

export interface ICommandCost {
    energy: number
    cooldown: number
    time: number
}

export interface ICommandEffect {
    id: string
    index: number
    radius: number
}

export interface ICommand extends IEntity {
    index: number
    meta: IMeta
    misc?: ICommandMisc
    cost?: ICommandCost
    effect?: ICommandEffect
}

export function convertAbility(parsedAbility: IParsedAbility): IAbility {
    const ability = {
        id: parsedAbility.id,
        index: parseInt(parsedAbility.index),
        command: convertOneOrMore(parsedAbility.command).map(convertCommand),
    }

    return ability
}

export function convertCommand(parsedCommand: IParsedCommand): ICommand {
    const id = parsedCommand.id
    const meta = convertMeta(parsedCommand.meta)
    meta.name = parsedCommand.id && utils.convertCamelCaseToSpacedCase(parsedCommand.id)

    return {
        id,
        index: parseIntNullable(parsedCommand.index),
        meta,
        misc: parsedCommand.misc ? convertCommandMisc(parsedCommand.misc) : undefined,
        cost: parsedCommand.cost ? convertCommandCost(parsedCommand.cost) : undefined,
        effect: parsedCommand.effect ? convertCommandEffect(parsedCommand.effect) : undefined,
    }
}

function convertCommandMisc(parsedCommandMisc: IParsedCommandMisc): ICommandMisc {
    return {
        range: parseIntNullable(parsedCommandMisc.range)
    }
}

function convertCommandCost(parsedCommandCost: IParsedCommandCost): ICommandCost {
    return {
        cooldown: parseIntNullable(parsedCommandCost.cooldown),
        energy: parseIntNullable(parsedCommandCost.energy),
        time: parseFloatNullable(parsedCommandCost.time),
    }
}

function convertCommandEffect(parsedCommandEffect: IParsedCommandEffect): ICommandEffect {
    return {
        id: parsedCommandEffect.id,
        index: parseIntNullable(parsedCommandEffect.index),
        radius: parseFloatNullable(parsedCommandEffect.radius),
    }
}

export interface IParsedUpgrades {
    upgrade: IParsedUpgrade[]
}

export interface IParsedUpgrade extends IEntity {
    index: string
    level: IParsedUpgradeLevel | IParsedUpgradeLevel[]
}

export interface IParsedBuildingUpgrades {
    upgrade: IParsedBuildingUpgrade[]
}

export interface IUpgrade extends IEntity {
    name: string
    index: number
    levels: IUpgradeLevel[]
}

export function convertUpgrade(parsedUpgrade: IParsedUpgrade): IUpgrade {
    const levels = parsedUpgrade.level
        ? convertOneOrMore(parsedUpgrade.level)
        : []

    const firstLevel = levels[0]
    const id = parsedUpgrade.id

    return {
        id,
        name: parsedUpgrade.id,
        index: parseInt(parsedUpgrade.index),
        levels: levels.map(l => convertUpgradeLevel(l, parsedUpgrade.id)),
    }
}

export interface IParsedUpgradeLevel extends IEntity {
    index: string
    requires: IParsedLevelRequires
    meta: IParsedMeta
    cost: IParsedCost
}
export interface IUpgradeLevel extends IEntity {
    index: number
    requires: ILevelRequires
    meta: IMeta
    cost: ICost
}

export function convertUpgradeLevel(parsedUpgradeLevel: IParsedUpgradeLevel, name: string = ''): IUpgradeLevel {
    const id = parsedUpgradeLevel.id
    const meta = convertMeta(parsedUpgradeLevel.meta)
    meta.name = typeof parsedUpgradeLevel.id === 'string'
        ? utils.convertCamelCaseToSpacedCase(parsedUpgradeLevel.id)
        : name

    return {
        id,
        index: parseInt(parsedUpgradeLevel.index),
        requires: parsedUpgradeLevel.requires && convertLevelRequires(parsedUpgradeLevel.requires),
        meta,
        cost: convertCost(parsedUpgradeLevel.cost),
    }
}

export interface IParsedLevelRequires {
    upgrade: IUnitReference
    unit: IUnitReference
}

export interface ILevelRequires {
    upgrade: IUnitReference
    unit: IUnitReference
}

export function convertLevelRequires(parsedLevelRequires: IParsedLevelRequires): ILevelRequires {
    return {
        upgrade: parsedLevelRequires.upgrade && convertUnitReference(parsedLevelRequires.upgrade),
        unit: parsedLevelRequires.unit && convertUnitReference(parsedLevelRequires.unit),
    }
}

export interface IParsedBuildingUpgrade extends IEntity {
    index: string
    ability: string
    meta: IParsedMeta
    cost: IParsedCost
}

export interface IBuildingUpgrade extends IEntity {
    index: number
    ability: number
    meta: IMeta
    cost: ICost
}

export function convertBuildingUpgrade(parsedBuildingUpgrade: IParsedBuildingUpgrade): IBuildingUpgrade {
    const id = parsedBuildingUpgrade.id
    const meta = convertMeta(parsedBuildingUpgrade.meta)
    meta.name = parsedBuildingUpgrade.id && utils.convertCamelCaseToSpacedCase(parsedBuildingUpgrade.id)

    return {
        id,
        ability: parseInt(parsedBuildingUpgrade.ability),
        index: parseInt(parsedBuildingUpgrade.index),
        meta,
        cost: convertCost(parsedBuildingUpgrade.cost),
    }
}
