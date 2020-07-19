import { unit } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal, getRaceFromName } from './utilities'
import { sc2InfoUrlBase } from '../constants'

export function generateBuildingUpgradeQuestions(upgrade: unit.IBuildingUpgrade): models.sc2iq.QuestionInput[] {
    const questions: models.sc2iq.QuestionInput[] = []

    if (upgrade.cost) {
        if (upgrade.cost.minerals) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(upgrade.cost.minerals)

            const name = upgrade.meta.name
            const question: models.sc2iq.QuestionInput = {
                id: `${upgrade.id}-upgrade-cost-minerals`,
                question: `What is the mineral cost of the upgrade ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name}`,
                    'upgrade',
                    `cost`,
                    `minerals`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/upgrades/${upgrade.id}`
            }

            questions.push(question)
        }

        if (upgrade.cost.vespene) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(upgrade.cost.vespene)

            const name = upgrade.meta.name
            const question: models.sc2iq.QuestionInput = {
                id: `${upgrade.id}-upgrade-cost-vespene`,
                question: `What is the vespene cost of the upgrade ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name}`,
                    'upgrade',
                    `cost`,
                    `vespene`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/upgrades/${upgrade.id}`
            }

            questions.push(question)
        }

        if (upgrade.cost.minerals && upgrade.cost.vespene) {
            const [
                minerals1,
                minerals2,
                minerals3,
                minerals4,
            ] = getNumberVariances(upgrade.cost.minerals)

            const [
                vespene1,
                vespene2,
                vespene3,
                vespene4,
            ] = getNumberVariances(upgrade.cost.vespene)

            const name = upgrade.meta.name
            const question: models.sc2iq.QuestionInput = {
                id: `${upgrade.id}-upgrade-cost`,
                question: `What is the cost of the ${name} upgrade?`,
                answer1: `${minerals1} / ${vespene1}`,
                answer2: `${minerals2} / ${vespene2}`,
                answer3: `${minerals3} / ${vespene3}`,
                answer4: `${minerals4} / ${vespene4}`,
                tags: [
                    `upgrade`,
                    `cost`,
                    `minerals`,
                    `vespene`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/upgrades/${upgrade.id}`
            }

            const race = getRaceFromName(name)
            if (race) {
                question.tags.push(race)
            }

            questions.push(question)
        }

        if (upgrade.cost.time) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(upgrade.cost.time)

            const name = upgrade.meta.name
            const question: models.sc2iq.QuestionInput = {
                id: `${upgrade.id}-upgrade-cost-time`,
                question: `How long does upgrade ${name} take research?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name}`,
                    'upgrade',
                    `time`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/upgrades/${upgrade.id}`
            }

            questions.push(question)
        }
    }

    return questions
}
