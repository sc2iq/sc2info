/**
 * Generates questions (KnowledgeBase) from balancedata.json
 */
import { unit, ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from './models'

function getNumberVariances(n: number): [number, number, number, number] {
    let answer1 = n
    let answer2: number
    let answer3: number
    let answer4: number

    // If small and fractional
    if (answer1 < 4 && Math.round(answer1) !== answer1) {
        answer2 = answer1 / 2
        answer3 = answer1 + 1
        answer4 = answer1 * 2
    }
    else if (answer1 < 15) {
        answer2 = answer1 - 1
        answer3 = answer1 + 1
        answer4 = answer1 + 2
    }
    else if (answer1 < 100) {
        answer2 = answer1 - 5
        answer3 = answer1 + 5
        answer4 = answer1 + 10
    }
    else if (answer1 < 200) {
        answer2 = answer1 - 5
        answer3 = answer1 + 5
        answer4 = answer1 + 10
    }
    else if (answer1 < 300) {
        answer2 = answer1 - 10
        answer3 = answer1 + 10
        answer4 = answer1 + 20
    }
    else {
        answer2 = answer1 - 20
        answer3 = answer1 + 20
        answer4 = answer1 + 30
    }

    return [
        answer1,
        answer2,
        answer3,
        answer4,
    ]
}

const regex = /([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g
function camelCaseToNormal(s: string): string {
    return s.replace(regex, '$& ')
}

function getRandomValue<T>(values: T[]): T {
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
}

type Race = "terran" | "zerg" | "protoss"
const races: Race[] = ["terran", "zerg", "protoss"]

function getRaceFromName(name: string): Race | undefined {
    const lowerName = name.toLowerCase()

    for (const race of races) {
        if (lowerName.includes(race)) {
            return race
        }
    }
}

const attributes = [
    "Psionic",
    "Massive",
    "Armored",
    "Mechanical",
    "Structure",
    "Biological",
    "Light",
]

const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
const vowelSoundingWords: string[] = [
]

const constantSoundingWords: string[] = [
]

function getPrecedingArticle(word: string): "a" | "an" {
    if (vowelSoundingWords.includes(word.toLowerCase())) {
        return "an"
    }
    else if (constantSoundingWords.includes(word.toLowerCase())) {
        return "a"
    }

    if (vowels.includes(word[0].toLowerCase())) {
        return "an"
    }

    return "a"
}

function getOtherAttributes(attribute: string): [string, string, string, string] {
    const answers: string[] = [
        attribute
    ]

    for (let i = 0; i < 4; i++) {
        let answer: string | undefined
        while (answer !== attribute) {
            answer = getRandomValue(attributes)
        }

        answers.push(answer)
    }

    return answers as [string, string, string, string]
}

function generateUnitQuestions(unit: unit.IUnitNode): models.QuestionInput[] {
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/unit/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                question: `What are the shield armor of ${article} ${camelCaseToNormal(name)}?.`,
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
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
                source: `https://sc2info.surge.sh/units/${unit.id}`
            }

            questions.push(question)
        }
    }

    return questions
}

function generateBuildingQuestions(building: unit.IUnitNode): models.QuestionInput[] {
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
                question: `What is the shields of ${article} ${camelCaseToNormal(name)}?.`,
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

function generateWeaponQuestions(weapon: unit.IWeapon): models.QuestionInput[] {
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
                source: `https://sc2info.surge.sh/weapons/${weapon.id}`
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
                    source: `https://sc2info.surge.sh/weapons/${weapon.id}`
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
                    source: `https://sc2info.surge.sh/weapons/${weapon.id}`
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
                source: `https://sc2info.surge.sh/weapons/${weapon.id}`
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
                source: `https://sc2info.surge.sh/weapons/${weapon.id}`
            }

            questions.push(question)
        }
    }

    return questions
}

function generateUpgradeQuestions(level: unit.IUpgradeLevel): models.QuestionInput[] {
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

function generateBuildingUpgradeQuestions(upgrade: unit.IBuildingUpgrade): models.QuestionInput[] {
    const questions: models.QuestionInput[] = []

    if (upgrade.cost) {
        if (upgrade.cost.minerals) {
            const [
                answer1,
                answer2,
                answer3,
                answer4,
            ] = getNumberVariances(upgrade.cost.minerals)

            const name = upgrade.meta.name
            const question: models.QuestionInput = {
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
                source: `https://sc2info.surge.sh/upgrades/${upgrade.id}`
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
            const question: models.QuestionInput = {
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
                source: `https://sc2info.surge.sh/upgrades/${upgrade.id}`
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
            const question: models.QuestionInput = {
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
                source: `https://sc2info.surge.sh/upgrades/${upgrade.id}`
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
            const question: models.QuestionInput = {
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
                source: `https://sc2info.surge.sh/upgrades/${upgrade.id}`
            }

            questions.push(question)
        }
    }

    return questions
}

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