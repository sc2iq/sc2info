import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal } from './utilities'
import { sc2InfoUrlBase } from '../constants'

export function generateUnitQuestions(unit: unit.IUnitNode): models.QuestionInput[] {
    const questions: models.QuestionInput[] = []
    const name = unit.meta.name
    const article = getPrecedingArticle(name)

    // unit.abilities

    if (unit.armor) {
        if (unit.armor.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.armor.max)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-armor`,
                question: `What is the armor of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name.toLowerCase()}`,
                    `${unit.meta.race}`,
                    'unit',
                    `armor`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    // unit.attributes

    if (unit.cost) {
        if (unit.cost.minerals) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.minerals)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-cost-minerals`,
                question: `What is the mineral cost of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${name.toLowerCase()}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `cost`,
                    `minerals`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/unit/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.cost.vespene) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.vespene)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-cost-vespene`,
                question: `What is the vespene cost of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name.toLowerCase()}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `cost`,
                    `vespene`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.cost.minerals && unit.cost.vespene) {
            const [
                minerals1,
                minerals2,
                minerals3,
                minerals4,
            ] = getNumberVariances(unit.cost.minerals)

            const [
                vespene1,
                vespene2,
                vespene3,
                vespene4,
            ] = getNumberVariances(unit.cost.vespene)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-cost`,
                question: `What is the cost of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${minerals1} / ${vespene1}`,
                answer2: `${minerals2} / ${vespene2}`,
                answer3: `${minerals3} / ${vespene3}`,
                answer4: `${minerals4} / ${vespene4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `cost`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.cost.supply) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.supply)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-cost-supply`,
                question: `What is the supply cost of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `cost`,
                    `supply`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.cost.time) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.time)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-cost-time`,
                question: `How many game seconds does it take to build ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `cost`,
                    `time`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    // building.meta

    if (unit.shields) {
        if (unit.shields.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.shields.max)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-shields`,
                question: `What is the shields of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.race}`,
                    `unit`,
                    `shields`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    if (unit.shieldArmor) {
        if (unit.shieldArmor.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.shieldArmor.max)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-shieldarmor`,
                question: `What is the shield armor of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.race}`,
                    `unit`,
                    `shields`,
                    `armor`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    if (unit.misc) {
        if (unit.misc.radius) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.misc.radius)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-misc-radius`,
                question: `What is the radius of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `misc`,
                    `radius`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.misc.sightRadius) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.misc.sightRadius)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-misc-sightradius`,
                question: `What is the sight radius of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `misc`,
                    `sight`,
                    `radius`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    if (unit.movement) {
        if (unit.movement.speed) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.movement.speed)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-movement-speed`,
                question: `What is the speed of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `movement`,
                    `speed`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        if (unit.movement.acceleration) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.movement.speed)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-movement-acceleration`,
                question: `What is the acceleration of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `movement`,
                    `acceleration`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }

        // Don't include, to obscure?
        if (false && unit.movement.turnRate) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.movement.turnRate)

            const question: models.QuestionInput = {
                id: `${unit.id}-unit-movement-turnrate`,
                question: `What is the turn rate of ${article} ${camelCaseToNormal(name)}?`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.name}`,
                    `${unit.meta.race}`,
                    `unit`,
                    `movement`,
                    `turnRate`,
                ],
                difficulty: 1,
                source: `${sc2InfoUrlBase}/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    return questions
}
