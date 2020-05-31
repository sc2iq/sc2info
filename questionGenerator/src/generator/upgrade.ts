import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal, getRaceFromName } from './utilities'

export function generateUpgradeQuestions(level: unit.IUpgradeLevel): models.QuestionInput[] {
    const questions: models.QuestionInput[] = []

    if (level.cost) {
        if (level.cost.minerals) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(level.cost.minerals)

            const name = level.meta.name
            const question: models.QuestionInput = {
                id: `${level.id}-upgrade-cost-minerals`,
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
                source: `https://sc2info.surge.sh/upgrades/${level.id}`
            }

            questions.push(question)
        }

        if (level.cost.vespene) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(level.cost.vespene)

            const name = level.meta.name
            const question: models.QuestionInput = {
                id: `${level.id}-upgrade-cost-vespene`,
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
                source: `https://sc2info.surge.sh/upgrades/${level.id}`
            }

            questions.push(question)
        }

        if (level.cost.minerals && level.cost.vespene) {
            const [
                minerals1,
                minerals2,
                minerals3,
                minerals4,
            ] = getNumberVariances(level.cost.minerals)

            const [
                vespene1,
                vespene2,
                vespene3,
                vespene4,
            ] = getNumberVariances(level.cost.vespene)

            const name = level.meta.name
            const question: models.QuestionInput = {
                id: `${level.id}-upgrade-cost`,
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
                source: `https://sc2info.surge.sh/upgrades/${level.id}`
            }

            const race = getRaceFromName(name)
            if (race) {
                question.tags.push(race)
            }

            questions.push(question)
        }

        if (level.cost.time) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(level.cost.time)

            const name = level.meta.name
            const question: models.QuestionInput = {
                id: `${level.id}-upgrade-cost-time`,
                question: `How long does upgrade ${name} take research?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name}`,
                    `upgrade`,
                    `cost`,
                    `time`,
                ],
                difficulty: 1,
                source: `https://sc2info.surge.sh/upgrades/${level.id}`
            }

            questions.push(question)
        }
    }

    return questions
}
