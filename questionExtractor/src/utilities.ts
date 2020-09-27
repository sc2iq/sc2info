import Fuse from 'fuse.js'
import { units, buildings, weapons, articles, fillers, } from './constants'
import { features } from './features'
import { fetchUnitData, fetchBuildingData, fetchWeaponData } from './queries'
import * as models from './model'

// Sentence Options
const phraseFuseOptions: Fuse.IFuseOptions<string> = {
    includeScore: true,
    isCaseSensitive: false,
    // shouldSort: true,
    includeMatches: true,
    findAllMatches: true,
    // minMatchCharLength: 1,
    location: 50,
    // threshold: 0.6,
    distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
}

const phraseFuseUnits = new Fuse(units, phraseFuseOptions)
const phraseFuseBuildings = new Fuse(buildings, phraseFuseOptions)
const phraseFuseWeapons = new Fuse(weapons, phraseFuseOptions)

// WordOptions Options
const wordFuseOptions: Fuse.IFuseOptions<string> = {
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
    includeMatches: true,
    // findAllMatches: false,
    minMatchCharLength: 4,
    location: 0,
    threshold: 0.3,
    distance: 20,
    // useExtendedSearch: false,
    ignoreLocation: false,
    // ignoreFieldNorm: false,
}

const wordFuseUnits = new Fuse(units, wordFuseOptions)
const wordFuseBuildings = new Fuse(buildings, wordFuseOptions)
const wordFuseWeapons = new Fuse(weapons, wordFuseOptions)

const featureStrings = [... new Set(features.flatMap(feature => feature.synonyms))]
const featureFuse = new Fuse(featureStrings, wordFuseOptions)

type Result = Fuse.FuseResult<string>

/**
 * Extract a source (unit, building, weapon, etc) and property (health, cost, attack)
 * If property is complex there may be path to make property more specific. E.g. [cost, minerals]
 */
export function extractSc2InfoKeywords(message: string): models.MixExtraction<Result> {
    const phraseExtractions = extractSc2InfoFromPhrase(message)
    const words = message.split(' ')
    const wordExtractions = words.flatMap(word => extractFromWord(word))
    const filteredWordExtractions = processExtractions(wordExtractions)
    const preparedExtraction = filteredWordExtractions.length > 0
        ? prepareExtractions(filteredWordExtractions)
        : undefined

    return {
        message,
        phraseExtractions,
        wordExtractions,
        filteredWordExtractions,
        preparedExtraction,
    }
}

function isExtractionEmpty<T>(extraction: models.GroupedExtraction<T>): boolean {
    return extraction.unit.length == 0
        && extraction.building.length == 0
        && extraction.weapon.length == 0
        && extraction.features.length == 0
}

function processExtractions(extractions: models.WordExtraction<Fuse.FuseResult<string>>[]): models.ProcessedExtraction[] {
    return extractions
        .filter(extraction => isExtractionEmpty(extraction) === false)
        .map(processExtraction)
}

function processExtraction(wordExtraction: models.WordExtraction<Fuse.FuseResult<string>>): models.ProcessedExtraction {
    const allMatches = [
        ...wordExtraction.unit,
        ...wordExtraction.building,
        ...wordExtraction.weapon,
        ...wordExtraction.features,
    ]

    const bestMatch = allMatches.sort((a, b) => (a.result.score ?? 1) - (b.result.score ?? 1))[0]
    if (!bestMatch) {
        throw new Error(`The extraction for word '${wordExtraction.word}' was not empty, but didn't have a result. This is a code error.`)
    }

    const type = bestMatch.sourceType
    const term = bestMatch.result.item

    return {
        term,
        type,
    }
}

function prepareExtractions(processedExtraction: models.ProcessedExtraction[]): models.PreparedExtraction | undefined {
    const featureStrings = processedExtraction
        .filter(pe => pe.type === models.ExtractionType.Feature)
        .map(pe => pe.term)

    const nonFeatures = processedExtraction
        .filter(pe => pe.type !== models.ExtractionType.Feature)

    const firstNonFeature = nonFeatures[0]
    if (firstNonFeature === undefined) {
        return undefined
    }

    const feature = getFeatureWithHighestMatch(firstNonFeature.type, featureStrings)

    return {
        ...firstNonFeature,
        feature
    }
}

function getFeatureWithHighestMatch(type: models.ExtractionType, featureStrings: string[]): models.Feature {
    const sortedFeatures = features
        .map(feature => {
            const synonymMatches = feature.synonyms.filter(synonym => featureStrings.includes(synonym))

            return {
                feature,
                synonymMatchCount: synonymMatches.length
            }
        })
        .sort((a, b) => b.synonymMatchCount - a.synonymMatchCount)

    const highestScoredFeature = sortedFeatures[0]
    if (!highestScoredFeature) {
        throw new Error(`Feature with highest score does not exist`)
    }

    return highestScoredFeature.feature
}

const extractPhraseUnits = extract(models.ExtractionType.Unit, phraseFuseUnits)
const extractPhraseBuildings = extract(models.ExtractionType.Building, phraseFuseBuildings)
const extractPhraseWeapons = extract(models.ExtractionType.Weapon, phraseFuseWeapons)

function extractSc2InfoFromPhrase(phrase: string): models.GroupedExtraction<Result> {
    const phraseUnitExtractions = extractPhraseUnits(phrase)
    const phraseBuildingExtractions = extractPhraseBuildings(phrase)
    const phraseWeaponExtractions = extractPhraseWeapons(phrase)

    return {
        unit: phraseUnitExtractions,
        building: phraseBuildingExtractions,
        weapon: phraseWeaponExtractions,
        features: [],
    }
}

const extractWordUnits = extract(models.ExtractionType.Unit, wordFuseUnits)
const extractWordBuildings = extract(models.ExtractionType.Building, wordFuseBuildings)
const extractWordWeapons = extract(models.ExtractionType.Weapon, wordFuseWeapons)
const extractWordFeatures = extract(models.ExtractionType.Feature, featureFuse)

function createDefaultExtraction(word: string): models.WordExtraction<Result> {
    return {
        word,
        unit: [],
        building: [],
        weapon: [],
        features: [],
    }
}

const ignoredWords = [...articles, ...fillers]
function extractFromWord(word: string): models.WordExtraction<Result> {
    const ignoreWord = ignoredWords.includes(word)
    if (ignoreWord) {
        return createDefaultExtraction(word)
    }

    const wordUnitFuseResults = extractWordUnits(word)
    const wordBuildingFuseResults = extractWordBuildings(word)
    const wordWeaponFuseResults = extractWordWeapons(word)
    const wordFeatureFuseResults = extractWordFeatures(word)

    return {
        word,
        unit: wordUnitFuseResults,
        building: wordBuildingFuseResults,
        weapon: wordWeaponFuseResults,
        features: wordFeatureFuseResults,
    }
}

function extract(type: models.ExtractionType, fuseSource: Fuse<string>) {
    return (input: string): models.Extraction<Fuse.FuseResult<string>>[] => {
        const results = fuseSource.search(input)
        return results.map(result => {
            return {
                original: input,
                sourceType: type,
                result
            }
        })
    }
}

export function getAnswerFromFeature(term: string, type: models.ExtractionType, feature: models.Feature, data: any): string {
    let answer

    switch (type) {
        case models.ExtractionType.Unit: {
            if (feature.type === models.FeatureType.Command) {
                const command = data.unit.commands[term]
                const value = feature.getCommandValue(command)
                answer = feature.getCommandAnswer(value, command)
            }
            else if (feature.type === models.FeatureType.Weapon) {
                // TODO: Make list of primary weapons per unit instead of taking first
                const weapon = data.unit.original.weapons[0]
                // TODO: Weapons on units don't have ids, perhaps fix service so they are sent back?
                // weapon.id = data.unit.id
                const value = feature.getWeaponValue(weapon)
                answer = feature.getWeaponAnswer(value, weapon)
            }
            else if (feature.type === models.FeatureType.Generic || feature.type === models.FeatureType.Unit) {
                const value = feature.getUnitValue(data.unit)
                answer = feature.getUnitAnswer(value, data.unit)
            }
            break
        }
        case models.ExtractionType.Building: {
            if (feature.type === models.FeatureType.Generic || feature.type === models.FeatureType.Building) {
                const value = feature.getBuildingValue(data.building)
                answer = feature.getBuildingAnswer(value, data.building)
            }
            break
        }
        case models.ExtractionType.Weapon: {
            if (feature.type === models.FeatureType.Generic || feature.type === models.FeatureType.Weapon) {
                const value = feature.getWeaponValue(data.weapon)
                answer = feature.getWeaponAnswer(value, data.weapon)
            }
            break
        }
    }

    if (answer == undefined) {
        throw new Error(`Extraction type ${type} is not handled`)
    }

    return answer
}

export async function getExtractionData(extraction: models.PreparedExtraction): Promise<unknown> {
    const space = /\s/
    const termId = extraction.term.replace(space, '')

    let json = {}
    switch (extraction.type) {
        case models.ExtractionType.Unit: {
            json = await fetchUnitData(termId)
            break
        }
        case models.ExtractionType.Building: {
            json = await fetchBuildingData(termId)
            break
        }
        case models.ExtractionType.Weapon: {
            json = await fetchWeaponData(termId)
            break
        }
    }

    return json
}