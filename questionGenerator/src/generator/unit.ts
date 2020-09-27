import { unit } from '@sc2/convertbalancedata'
import * as models from '../models'
import { getPrecedingArticle, getNumberVariances, camelCaseToNormal } from './utilities'
import { sc2InfoUrlBase } from '../constants'

export function generateUnitQuestions(unit: unit.IUnitNode): models.GenerateResult {
    const sc2iqQuestions: models.sc2iq.QuestionInput[] = []
    const kbQuestions: models.qna.Question[] = []
    const luisEntities: string[] = ['property', 'unit']
    const questionIntent = 'question'
    const luisIntentsWithUtterances: Record<string, string[]> = { [questionIntent]: [] }
    const name = unit.meta.name
    const article = getPrecedingArticle(name)
    const metadata = [
        {
            name: 'race',
            value: unit.meta.race,
        }
    ]

    // unit.abilities

    if (unit.armor) {
        if (unit.armor.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.armor.max)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
                id: `${unit.id}-unit-armor`,
                question: `What is the armor of ${article} ${name}?`,
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
                source
            }

            // Add sc2iq question
            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = armor} of ${article} {@unit = ${name}}?`,
                `How much {@property = armor} does the {@unit = ${name}} have?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has ${answer1} armor.`,
                source,
                questions: [
                    `What is the armor of ${article} ${name}?`,
                    `${name} armor?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/unit/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            // Add sc2iq question
            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = mineral cost} of ${article} {@unit = ${name}}?`,
                `How many {@property = minerals} does the {@unit = ${name}} cost?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} costs ${answer1} minerals.`,
                source,
                questions: [
                    `What is the mineral cost of ${article} ${name}?`,
                    `How many minerals does the ${name} cost?`,
                    `${name} minerals?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        if (unit.cost.vespene) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.vespene)

            const source = `${sc2InfoUrlBase}/unit/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            // Add sc2iq question
            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = vespene} {@property = cost} of ${article} {@unit = ${name}}?`,
                `How much {@property = vespene} does the {@unit = ${name}} cost?`,
                `{@unit = ${name}} {@property = vespene}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} costs ${answer1} vespene.`,
                source,
                questions: [
                    `What is the vespene cost of ${article} ${name}?`,
                    `How many vespene does the ${name} cost?`,
                    `${name} vespene?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/unit/${unit.id}`
            const answer1 = `${minerals1} / ${vespene1}`
            const question: models.sc2iq.QuestionInput = {
                id: `${unit.id}-unit-cost`,
                question: `What is the cost of ${article} ${camelCaseToNormal(name)}?`,
                answer1,
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
                source
            }

            // Add sc2iq question
            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = cost} of ${article} {@unit = ${name}}?`,
                `How much does the {@unit = ${name}} {@property = cost}?`,
                `{@unit = ${name}} {@property = cost}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} costs ${answer1}.`,
                source,
                questions: [
                    `What is the cost of ${article} ${name}?`,
                    `How much does the ${name} cost?`,
                    `${name} cost?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        if (unit.cost.supply) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.supply)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = supply} of ${article} {@unit = ${name}}?`,
                `How many {@property = supply} is the {@unit = ${name}}?`,
                `{@unit = ${name}} {@property = supply}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} is ${answer1} supply.`,
                source,
                questions: [
                    `What is the supply of ${article} ${name}?`,
                    `How many supply is the ${name}?`,
                    `${name} supply?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        if (unit.cost.time) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.cost.time)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = build time} of ${article} {@unit = ${name}}?`,
                `How much {@property = time} does the {@unit = ${name}} take to build?`,
                `{@unit = ${name}} {@property = build time}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} build time is ${answer1}.`,
                source,
                questions: [
                    `What is the build time of ${article} ${name}?`,
                    `How many game seconds build time of the ${name}?`,
                    `${name} build time?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What are the {@property = shields} of ${article} {@unit = ${name}}?`,
                `How much {@property = shields} does the {@unit = ${name}} have?`,
                `{@unit = ${name}} {@property = shields}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has ${answer1} shields.`,
                source,
                questions: [
                    `What are the shields of ${article} ${name}?`,
                    `How many shields does the ${name} have?`,
                    `${name} shields?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What are the {@property = shields} of ${article} {@unit = ${name}}?`,
                `How much {@property = shields} does the {@unit = ${name}} have?`,
                `{@unit = ${name}} {@property = shields}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has ${answer1} shields.`,
                source,
                questions: [
                    `What are the shields of ${article} ${name}?`,
                    `How many shields does the ${name} have?`,
                    `${name} shields?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }
    }

    if (unit.life) {
        if (unit.life.max) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.life.max)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
                id: `${unit.id}-unit-life`,
                question: `What is the life of ${article} ${camelCaseToNormal(name)}?.`,
                answer1: `${answer1}`,
                answer2: `${answer2}`,
                answer3: `${answer3}`,
                answer4: `${answer4}`,
                tags: [
                    `${unit.meta.race}`,
                    `unit`,
                    `life`,
                ],
                difficulty: 1,
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = life} of ${article} {@unit = ${name}}?`,
                `How much {@property = life} does the {@unit = ${name}} have?`,
                `{@unit = ${name}} {@property = life}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has ${answer1} health.`,
                source,
                questions: [
                    `What is the health of ${article} ${name}?`,
                    `How much life does the ${name} have?`,
                    `${name} life?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = radius} of ${article} {@unit = ${name}}?`,
                `What is the {@property = size} of ${article} {@unit = ${name}}?`,
                `{@unit = ${name}} {@property = radius}?`,
                `{@unit = ${name}} {@property = size}?`,
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has radius of ${answer1}`,
                source,
                questions: [
                    `What is the radius of ${article} ${name}?`,
                    `What is the size of ${article} ${name}?`,
                    `${name} radius?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        if (unit.misc.sightRadius) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.misc.sightRadius)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = sight radius} of ${article} {@unit = ${name}}?`,
                `How far can the {@unit = ${name}} {@property = see}?`,
                `{@unit = ${name}} {@property = sight radius}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has sight radius of ${answer1}`,
                source,
                questions: [
                    `What is the sight radius of ${article} ${name}?`,
                    `Har far can the ${name} see?`,
                    `${name} sight radius?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
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

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = movement speed} of ${article} {@unit = ${name}}?`,
                `What is the {@property = speed} of ${article} {@unit = ${name}}?`,
                `How fast is the {@unit = ${name}}?`,
                `{@unit = ${name}} {@property = speed}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name} has speed of ${answer1}`,
                source,
                questions: [
                    `What is the speed of ${article} ${name}?`,
                    `How fast is the ${name}?`,
                    `${name} speed?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        if (unit.movement.acceleration) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.movement.speed)

            const source = `${sc2InfoUrlBase}/units/${unit.id}`
            const question: models.sc2iq.QuestionInput = {
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
                source
            }

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = acceleration} of ${article} {@unit = ${name}}?`,
                `{@unit = ${name}} {@property = acceleration}?`
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name}'s acceleration is ${answer1}`,
                source,
                questions: [
                    `What is the acceleration of ${article} ${name}?`,
                    `${name} acceleration?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }

        unit.original.abilities?.forEach(ability => {
            ability.command.forEach(command => {

                let abilityName = ability.id ? camelCaseToNormal(ability.id) : ''
                if (command.meta.name !== 'Execute') {
                    const commandName = command.meta.name ? camelCaseToNormal(command.meta.name) : ''
                    abilityName = `${abilityName} ${commandName}`
                }

                if (command.cost?.cooldown && command.cost.cooldown !== -1) {
                    const [
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                    ] = getNumberVariances(command.cost?.cooldown)

                    const question: models.sc2iq.QuestionInput = {
                        id: `${unit.id}-unit-abilities-${ability.id}-${command.meta.name}`,
                        question: `What is the cooldown duration of the ${name} ability ${abilityName}?`,
                        answer1: `${answer1}`,
                        answer2: `${answer2}`,
                        answer3: `${answer3}`,
                        answer4: `${answer4}`,
                        tags: [
                            `${unit.meta.name}`,
                            `${unit.meta.race}`,
                            `unit`,
                            `movement`,
                            `ability`,
                            `cost`,
                            `cooldown`,
                            `${abilityName}`,
                        ],
                        difficulty: 1,
                        source: `${sc2InfoUrlBase}/units/${unit.id}`
                    }

                    sc2iqQuestions.push(question)

                    // Add LU down data
                    const utterances: string[] = [
                        `What is the {@property = cooldown} of ${article} {@unit = ${name}}?`,
                        `{@unit = ${name}} {@property = cooldown}?`,
                    ]
                    luisIntentsWithUtterances[questionIntent].push(...utterances)

                    // Add knowledge base question
                    const kbQuestion: models.qna.Question = {
                        answer: `${name}'s cooldown is ${answer1}`,
                        source: question.source,
                        questions: [
                            `What is the cooldown of ${article} ${name}?`,
                            `${name} cooldown?`,
                        ],
                        metadata,
                    }

                    kbQuestions.push(kbQuestion)
                }

                if (command.cost?.energy && command.cost.energy !== -1) {
                    const [
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                    ] = getNumberVariances(command.cost?.energy)

                    const question: models.sc2iq.QuestionInput = {
                        id: `${unit.id}-unit-abilities-${ability.id}-${command.meta.name}`,
                        question: `What is the energy cost of the ${name} ability ${abilityName}?`,
                        answer1: `${answer1}`,
                        answer2: `${answer2}`,
                        answer3: `${answer3}`,
                        answer4: `${answer4}`,
                        tags: [
                            `${unit.meta.name}`,
                            `${unit.meta.race}`,
                            `unit`,
                            `movement`,
                            `ability`,
                            `cost`,
                            `energy`,
                            `${abilityName}`,
                        ],
                        difficulty: 1,
                        source: `${sc2InfoUrlBase}/units/${unit.id}`
                    }

                    sc2iqQuestions.push(question)

                    // Add LU down data
                    const utterances: string[] = [
                        `What is the {@property = energy cost} of ${article} {@unit = ${name}}?`,
                        `{@unit = ${name}} {@property = energy cost}?`,
                    ]
                    luisIntentsWithUtterances[questionIntent].push(...utterances)

                    // Add knowledge base question
                    const kbQuestion: models.qna.Question = {
                        answer: `${name}'s energy cost is ${answer1}`,
                        source: question.source,
                        questions: [
                            `What is the energy cost of ${article} ${name}?`,
                            `${name} energy cost?`,
                        ],
                        metadata,
                    }

                    kbQuestions.push(kbQuestion)
                }

                if (command.cost?.time && command.cost.time !== -1) {
                    const [
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                    ] = getNumberVariances(command.cost?.time)

                    const question: models.sc2iq.QuestionInput = {
                        id: `${unit.id}-unit-abilities-${ability.id}-${command.meta.name}`,
                        question: `What is the duration of the ${name} ability ${abilityName}?`,
                        answer1: `${answer1}`,
                        answer2: `${answer2}`,
                        answer3: `${answer3}`,
                        answer4: `${answer4}`,
                        tags: [
                            `${unit.meta.name}`,
                            `${unit.meta.race}`,
                            `unit`,
                            `movement`,
                            `ability`,
                            `cost`,
                            `time`,
                            `${abilityName}`,
                        ],
                        difficulty: 1,
                        source: `${sc2InfoUrlBase}/units/${unit.id}`
                    }

                    sc2iqQuestions.push(question)

                    // Add LU down data
                    const utterances: string[] = [
                        `What is the {@property = duration} of the ability {@unit = ${abilityName}}?`,
                        `{@unit = ${abilityName}} {@property = duration}?`,
                    ]
                    luisIntentsWithUtterances[questionIntent].push(...utterances)

                    // Add knowledge base question
                    const kbQuestion: models.qna.Question = {
                        answer: `${name}'s duration is ${answer1}`,
                        source: question.source,
                        questions: [
                            `What is the duration of ${article} ${name}?`,
                            `${name} duration?`,
                        ],
                        metadata,
                    }

                    kbQuestions.push(kbQuestion)
                }

                if (command.effect?.radius && command.effect.radius !== -1) {
                    const [
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                    ] = getNumberVariances(command.effect?.radius)

                    const question: models.sc2iq.QuestionInput = {
                        id: `${unit.id}-unit-abilities-${ability.id}-${command.meta.name}`,
                        question: `What is the radius of the ${name} ability ${abilityName}?`,
                        answer1: `${answer1}`,
                        answer2: `${answer2}`,
                        answer3: `${answer3}`,
                        answer4: `${answer4}`,
                        tags: [
                            `${unit.meta.name}`,
                            `${unit.meta.race}`,
                            `unit`,
                            `movement`,
                            `ability`,
                            `effect`,
                            `radius`,
                            `${abilityName}`,
                        ],
                        difficulty: 1,
                        source: `${sc2InfoUrlBase}/units/${unit.id}`
                    }

                    sc2iqQuestions.push(question)

                    // Add LU down data
                    const utterances: string[] = [
                        `What is the {@property = radius} of the ${name} ability {@unit = ${abilityName}}?`,
                        `{@unit = ${name}} {@property = radius}?`,
                    ]
                    luisIntentsWithUtterances[questionIntent].push(...utterances)

                    // Add knowledge base question
                    const kbQuestion: models.qna.Question = {
                        answer: `${name}'s radius is ${answer1}`,
                        source: question.source,
                        questions: [
                            `What is the radius of ${article} ${name}?`,
                            `${name} radius?`,
                        ],
                        metadata,
                    }

                    kbQuestions.push(kbQuestion)
                }

                if (command.misc?.range && command.misc.range !== -1) {
                    const [
                        answer1,
                        answer2,
                        answer3,
                        answer4,
                    ] = getNumberVariances(command.misc?.range)

                    const question: models.sc2iq.QuestionInput = {
                        id: `${unit.id}-unit-abilities-${ability.id}-${command.meta.name}`,
                        question: `What is the range of the ${name} ability ${abilityName}?`,
                        answer1: `${answer1}`,
                        answer2: `${answer2}`,
                        answer3: `${answer3}`,
                        answer4: `${answer4}`,
                        tags: [
                            `${unit.meta.name}`,
                            `${unit.meta.race}`,
                            `unit`,
                            `movement`,
                            `ability`,
                            `range`,
                            `${abilityName}`,
                        ],
                        difficulty: 1,
                        source: `${sc2InfoUrlBase}/units/${unit.id}`
                    }

                    sc2iqQuestions.push(question)

                    // Add LU down data
                    const utterances: string[] = [
                        `What is the {@property = range} of the ${name} ability {@unit = ${abilityName}}?`,
                        `{@unit = ${name}} {@property = range}?`,
                    ]
                    luisIntentsWithUtterances[questionIntent].push(...utterances)

                    // Add knowledge base question
                    const kbQuestion: models.qna.Question = {
                        answer: `${name}'s range is ${answer1}`,
                        source: question.source,
                        questions: [
                            `What is the range of ${article} ${name}?`,
                            `${name} range?`,
                        ],
                        metadata,
                    }

                    kbQuestions.push(kbQuestion)
                }
            })
        })

        // Don't include, to obscure?
        if (false && unit.movement.turnRate) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(unit.movement.turnRate)

            const question: models.sc2iq.QuestionInput = {
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

            sc2iqQuestions.push(question)

            // Add LU down data
            const utterances: string[] = [
                `What is the {@property = turn rate} of the {@unit = ${name}}?`,
                `{@unit = ${name}} {@property = turn rate}?`,
            ]
            luisIntentsWithUtterances[questionIntent].push(...utterances)

            // Add knowledge base question
            const kbQuestion: models.qna.Question = {
                answer: `${name}'s turn rate is ${answer1}`,
                source: question.source,
                questions: [
                    `What is the turn rate of ${article} ${name}?`,
                    `${name} turn rate?`,
                ],
                metadata,
            }

            kbQuestions.push(kbQuestion)
        }
    }

    return {
        luisEntities,
        luisIntentsWithUtterances,
        sc2iqQuestions,
        kbQuestions,
    }
}
