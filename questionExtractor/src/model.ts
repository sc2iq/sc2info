export enum ExtractionType {
    Building = 'building',
    Unit = 'unit',
    Weapon = 'weapons',
    Feature = 'feature',
}

export type Extraction<T> = {
    original: string
    sourceType: ExtractionType
    result: T
}

export type WordExtraction<T> =
    & GroupedExtraction<T>
    & {
        word: string
    }

export type GroupedExtraction<T> = {
    unit: Extraction<T>[]
    building: Extraction<T>[]
    weapon: Extraction<T>[]
    features: Extraction<T>[]
}

export type ProcessedExtraction = {
    type: ExtractionType
    term: string
}

export enum FeatureType {
    Generic = 'Generic',
    Unit = 'Unit',
    Building = 'Building',
    Weapon = 'Weapon',
    Command = 'Command',
}

type FeatureBase = {
    name: string
    synonyms: string[]
}

type UnitData<U> = {
    getUnitValue: (unit: U) => string | number
    getUnitAnswer: (value: string | number, unit: U) => string
}

export type UnitFeature<U> =
    & FeatureBase
    & UnitData<U>
    & {
        type: FeatureType.Unit
    }

type BuildingData<B> = {
    getBuildingValue: (building: B) => string | number
    getBuildingAnswer: (value: string | number, unit: B) => string
}

export type BuildingFeature<B> =
    & FeatureBase
    & BuildingData<B>
    & {
        type: FeatureType.Building
    }

type WeaponData<W> = {
    getWeaponValue: (weapon: W) => string | number
    getWeaponAnswer: (value: string | number, unit: W) => string
}

export type WeaponFeature<W> =
    & FeatureBase 
    & WeaponData<W>
    & {
        type: FeatureType.Weapon
    }

type CommandData<C> = {
    getCommandValue: (command: C) => string | number
    getCommandAnswer: (value: string | number, unit: C) => string
}

export type CommandFeature<C> =
    & FeatureBase
    & CommandData<C>
    & {
        type: FeatureType.Command
    }

export type GenericFeature<U, B, W> =
    & FeatureBase
    & UnitData<U>
    & BuildingData<B>
    & WeaponData<W>
    & {
        type: FeatureType.Generic
    }

export type Feature<U = any, B = any, W = any, C = any> =
    | GenericFeature<U, B, W>
    | UnitFeature<U>
    | BuildingFeature<B>
    | WeaponFeature<W>
    | CommandFeature<C>


/**
 * The system is limited to getting one feature/property of a type (Unit, Building, Weapon)
 * 
 * {
 *   type: Unit,
 *   term: "Marine",
 *   feature: {
 *     name: "cost",
 *     ...
 *   }
 * }
 */
export type PreparedExtraction =
    & ProcessedExtraction
    & {
        feature: Feature<any, any, any, any>
    }

export type MixExtraction<T> = {
    message: string
    phraseExtractions: GroupedExtraction<T>
    wordExtractions: WordExtraction<T>[]
    filteredWordExtractions: ProcessedExtraction[]
    preparedExtraction?: PreparedExtraction
}
