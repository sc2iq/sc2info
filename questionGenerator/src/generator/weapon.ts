import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal, getOtherAttributes } from './utilities'
import { sc2InfoUrlBase } from '../constants'

export function generateWeaponQuestions(weapon: unit.IWeapon): models.QuestionInput[] {
    const questions: models.QuestionInput[] = []
    const name = weapon.meta.name
    const article = getPrecedingArticle(name)

    if (weapon.effect) {
        if (weapon.effect.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(weapon.effect.max)

            const question: models.QuestionInput = {
                id: `${weapon.id}-weapon-damage`,
                question: `What is the damage of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${weapon.meta.name}`,
                    'weapon',
                    `damage`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/weapons/${weapon.id}`
            }

            questions.push(question)
        }

        if (weapon.effect.bonus) {
            if (weapon.effect.bonus?.max) {
                const [
                    answer1,
                    answer2,
                    answer3,
                    answer4,
                ] = getNumberVariances(weapon.effect.bonus?.max)

                const question: models.QuestionInput = {
                    id: `${weapon.id}-weapon-bonus-damage`,
                    question: `What is the bonus damage of the ${weapon.meta.name} weapon?.`,
                    answer1: `${answer1}`,
                    answer2: `${answer2}`,
                    answer3: `${answer3}`,
                    answer4: `${answer4}`,
                    tags: [
                        `${weapon.meta.name}`,
                        'weapon',
                        `damage`,
                    ],
                    difficulty: 1,
                    source: `${sc2InfoUrlBase}/weapons/${weapon.id}`
                }

                questions.push(question)
            }

            if (weapon.effect.bonus?.type) {
                const [
                    answer1,
                    answer2,
                    answer3,
                    answer4,
                ] = getOtherAttributes(weapon.effect.bonus?.type)

                const question: models.QuestionInput = {
                    id: `${weapon.id}-weapon-bonus-target`,
                    question: `What unit attribute does the ${weapon.meta.name} weapon do bonus damage to?.`,
                    answer1: `${answer1}`,
                    answer2: `${answer2}`,
                    answer3: `${answer3}`,
                    answer4: `${answer4}`,
                    tags: [
                        `${weapon.meta.name}`,
                        'weapon',
                        `bonus`,
                        `attribute`,
                    ],
                    difficulty: 1,
                    source: `${sc2InfoUrlBase}/weapons/${weapon.id}`
                }

                questions.push(question)
            }
        }
    }

    if (weapon.misc) {
        if (weapon.effect.kind === "Ranged" && weapon.misc.range) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(weapon.misc.range)

            const question: models.QuestionInput = {
                id: `${weapon.id}-weapon-range`,
                question: `What is range of the ${weapon.meta.name} weapon?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${weapon.meta.name}`,
                    'weapon',
                    `range`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/weapons/${weapon.id}`
            }

            questions.push(question)
        }

        if (weapon.misc.speed) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(weapon.misc.speed)

            const question: models.QuestionInput = {
                id: `${weapon.id}-weapon-speed`,
                question: `What is speed of the ${weapon.meta.name} weapon?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${weapon.meta.name}`,
                    'weapon',
                    `speed`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/weapons/${weapon.id}`
            }

            questions.push(question)
        }
    }

    return questions
}