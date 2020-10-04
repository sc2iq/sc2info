import { assert } from 'console'
import { extractSc2InfoKeywords } from './utilities'
import { ExtractionType, FeatureType } from './model'

describe('extractSc2InfoKeywords', () => {

    const testInputs = {
        'marine time': {
            term: 'Marine',
            type: ExtractionType.Unit,
            featureName: 'cost.time',
            featureType: FeatureType.Generic,
        },
        'colossi cost': {
            term: 'Colossus',
            type: ExtractionType.Unit,
            featureName: 'cost',
            featureType: FeatureType.Generic
        },
        'how much life does a marine have?': {
            term: 'Marine',
            type: ExtractionType.Unit,
            featureName: 'life',
            featureType: FeatureType.Unit,
        },
        'marine supply?': {
            term: 'Marine',
            type: ExtractionType.Unit,
            featureName: 'cost.supply',
            featureType: FeatureType.Generic,
        },
        'stalker damage': {
            term: 'Stalker',
            type: ExtractionType.Unit,
            featureName: 'weapon.damage',
            featureType: FeatureType.Weapon,
        },
        'barracks cost': {
            term: 'Barracks',
            type: ExtractionType.Building,
            featureName: 'cost',
            featureType: FeatureType.Generic,
        },
        'guass rifle damage': {
            term: 'Guass Rifle',
            type: ExtractionType.Weapon,
            featureName: 'weapon.damage',
            featureType: FeatureType.Weapon,
        },
        'tumor sight range': {
            term: 'Creep Tumor',
            type: ExtractionType.Building,
            featureName: 'misc.sightRadius',
            featureType: FeatureType.Unit
        },
        'void strengths': {
            term: 'Void Ray',
            type: ExtractionType.Unit,
            featureName: 'strengths',
            featureType: FeatureType.Unit
        },
        'void counters': {
            term: 'Void Ray',
            type: ExtractionType.Unit,
            featureName: 'weaknesses',
            featureType: FeatureType.Unit
        }
    }

    Object.entries(testInputs).forEach(([phrase, expectedExtractionData]) => {
        test(phrase, async () => {
            const extraction = extractSc2InfoKeywords(phrase)

            expect(extraction.preparedExtraction?.term).toBe(expectedExtractionData.term)
            expect(extraction.preparedExtraction?.type).toBe(expectedExtractionData.type)
            expect(extraction.preparedExtraction?.feature.name).toBe(expectedExtractionData.featureName)
            expect(extraction.preparedExtraction?.feature.type).toBe(expectedExtractionData.featureType)
        })
    })
})