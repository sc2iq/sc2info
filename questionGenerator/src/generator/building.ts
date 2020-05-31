import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal } from './utilities'

export function generateBuildingQuestions(building: unit.IUnitNode): models.QuestionInput[] {
    const questions: models.QuestionInput[] = []
    const name = building.meta.name
    const article = getPrecedingArticle(name)

    // building.abilities

    if (building.armor) {
        if (building.armor.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.armor.max)

            const question: models.QuestionInput = {
                id: `${building.id}-building-armor`,
                question: `What is the armor of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    'building',
                    `armor`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    // building.attributes

    if (building.cost) {
        if (building.cost.minerals) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.cost.minerals)

            const question: models.QuestionInput = {
                id: `${building.id}-building-cost-minerals`,
                question: `What is the mineral cost of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `cost`,
                    `minerals`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }

        if (building.cost.vespene) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.cost.vespene)

            const question: models.QuestionInput = {
                id: `${building.id}-building-cost-vespene`,
                question: `What is the vespene cost of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `cost`,
                    `vespene`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }

        if (building.cost.minerals && building.cost.vespene) {
            const [
                minerals1,
                minerals2,
                minerals3,
                minerals4,
            ] = getNumberVariances(building.cost.minerals)

            const [
                vespene1,
                vespene2,
                vespene3,
                vespene4,
            ] = getNumberVariances(building.cost.vespene)

            const question: models.QuestionInput = {
                id: `${building.id}-building-cost`,
                question: `What is the cost of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${minerals1} / ${vespene1}`,
                answer2: `${minerals2} / ${vespene2}`,
                answer3: `${minerals3} / ${vespene3}`,
                answer4: `${minerals4} / ${vespene4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `cost`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    // building.id

    if (building.life) {
        if (building.life.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.life.max)

            const question: models.QuestionInput = {
                id: `${building.id}-building-life`,
                question: `What is the health of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    'building',
                    `life`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    // building.meta

    if (building.shields) {
        if (building.shields.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.shields.max)

            const question: models.QuestionInput = {
                id: `${building.id}-building-shields`,
                question: `What is the shield amount of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `shields`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    if (building.shieldArmor) {
        if (building.shieldArmor.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.shieldArmor.max)

            const question: models.QuestionInput = {
                id: `${building.id}-building-shieldarmor`,
                question: `What is the shield armor of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `shields`,
                    `armor`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    if (building.misc) {
        if (building.misc.radius) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(building.misc.radius)

            const question: models.QuestionInput = {
                id: `${building.id}-building-radius`,
                question: `What is the radius of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${building.meta.race}`,
                    `building`,
                    `radius`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/buildings/${building.id}`
            }

            questions.push(question)
        }
    }

    return questions
}
