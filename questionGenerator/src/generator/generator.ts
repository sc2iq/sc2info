/**
 * Generates questions (KnowledgeBase) from balancedata.json
 */
import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from '../models'
import { generateUnitQuestions } from './unit'
import { generateBuildingQuestions } from './building'
import { generateWeaponQuestions } from './weapon'
import { generateUpgradeQuestions } from './upgrade'
import { generateBuildingUpgradeQuestions } from './buildingUpgrade'

const featureEntities: string[] = [
    'units',
    'property',
]

export default function generate(balanceData: ICategorizedUnits): models.GenerateResult {
    const questionsUnits = balanceData.units.flatMap(unit => generateUnitQuestions(unit))
    const questionsBuildings = balanceData.buildings.flatMap(building => generateBuildingQuestions(building))
    const questionsBuildingUpgrades = balanceData.buildingUpgrades.flatMap(buildingUpgrade => generateBuildingUpgradeQuestions(buildingUpgrade))
    const questionsWeapons = balanceData.weapons.flatMap(weapon => generateWeaponQuestions(weapon))
    const questionsUpgrades = balanceData.upgrades.flatMap(upgrade => generateUpgradeQuestions(upgrade))

    const luisEntities: string[] = [
        // Fixed properties of every unit
        ...featureEntities,
    ]

    const luisIntentsWithUtterances: Record<string, string[]> = {}
    questionsUnits.forEach(qu => {
        Object.entries(qu.luisIntentsWithUtterances)
            .forEach(([intent, utterances]) => {
                luisIntentsWithUtterances[intent] = luisIntentsWithUtterances[intent] ?? []
                luisIntentsWithUtterances[intent].push(...utterances)
            })
        })

    const sc2iqQuestions: models.sc2iq.QuestionInput[] = [
        ...questionsUnits.flatMap(qu => qu.sc2iqQuestions),
        ...questionsBuildings,
        ...questionsBuildingUpgrades,
        ...questionsWeapons,
        // ...questionsUpgrades,
    ]

    const kbQuestions: models.qna.Question[] = [
        ...questionsUnits.flatMap(qu => qu.kbQuestions),
    ]

    return {
        luisEntities,
        luisIntentsWithUtterances,
        sc2iqQuestions,
        kbQuestions,
    }
}