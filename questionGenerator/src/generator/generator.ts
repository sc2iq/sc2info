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

export default function generate(balanceData: ICategorizedUnits): models.QuestionInput[] {
    const questionsUnits = balanceData.units.flatMap(unit => generateUnitQuestions(unit))
    const questionsBuildings = balanceData.buildings.flatMap(building => generateBuildingQuestions(building))
    const questionsBuildingUpgrades = balanceData.buildingUpgrades.flatMap(buildingUpgrade => generateBuildingUpgradeQuestions(buildingUpgrade))
    const questionsWeapons = balanceData.weapons.flatMap(weapon => generateWeaponQuestions(weapon))
    const questionsUpgrades = balanceData.upgrades.flatMap(upgrade => generateUpgradeQuestions(upgrade))

    const questions: models.QuestionInput[] = [
        ...questionsUnits,
        ...questionsBuildings,
        ...questionsBuildingUpgrades,
        ...questionsWeapons,
        // ...questionsUpgrades,
    ]

    return questions
}