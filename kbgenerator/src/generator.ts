/**
 * Generates questions (KnowledgeBase) from balancedata.json
 */
import { ICategorizedUnits } from '@sc2/convertbalancedata'
import * as models from './models'

export default function generateKnowledgeBase(balanceData: ICategorizedUnits): models.KnowledgeBaseCreate {
    const source = 'Balance Data'

    // units: unit.IUnitNode[];
    // buildings: unit.IUnitNode[];

    // upgrades: unit.IUpgradeLevel[];
    const questionsUpgrades = balanceData.buildings.flatMap(b => {
        const metadata = [
            {
                name: 'race',
                value: b.meta.race,
            }
        ]

        const questions = []

        if (b.cost) {
            if (b.cost.minerals) {
                const minerals: models.Question = {
                    answer: `${b.meta.name} costs ${b.cost.minerals} minerals.`,
                    source,
                    questions: [
                        `How many minerals does ${b.meta.name} cost?`,
                        `${b.meta.name} minerals?`,
                    ],
                    metadata,
                }

                questions.push(minerals)
            }

            if (b.cost.vespene) {
                const vespene: models.Question = {
                    answer: `${b.meta.name} costs ${b.cost.vespene} gas.`,
                    source,
                    questions: [
                        `How much gas does ${b.meta.name} cost?`,
                        `${b.meta.name} gas?`,
                    ],
                    metadata,
                }

                questions.push(vespene)
            }

            if (b.cost.minerals && b.cost.vespene) {
                const cost: models.Question = {
                    answer: `${b.meta.name} costs ${b.cost.minerals} minerals and ${b.cost.vespene} gas.`,
                    source,
                    questions: [
                        `How much does ${b.meta.name} cost?`,
                        `${b.meta.name} cost?`,
                    ],
                    metadata,
                }

                questions.push(cost)
            }
        }

        return questions
    })

    // weapons: unit.IWeapon[];
    const questionsWeapon = balanceData.weapons.flatMap(w => {
        const metadata = [
            {
                name: 'race',
                value: w.meta.race,
            }
        ]

        const questions = []

        if (w.effect) {
            if (w.effect.max) {
                if (w.effect.bonus) {
                    const damage: models.Question = {
                        answer: `${w.meta.name} does ${w.effect.max} (${w.effect.bonus.max}) damage.`,
                        source,
                        questions: [
                            `How much damage does ${w.meta.name} do?`,
                            `${w.meta.name} damage?`,
                        ],
                        metadata,
                    }

                    questions.push(damage)
                }
                else {
                    const damage: models.Question = {
                        answer: `${w.meta.name} does ${w.effect.max} damage.`,
                        source,
                        questions: [
                            `How much damage does ${w.meta.name} do?`,
                            `${w.meta.name} damage?`,
                        ],
                        metadata,
                    }

                    questions.push(damage)
                }
            }
        }

        if (w.misc.speed) {
            const speed: models.Question = {
                answer: `${w.meta.name} has speed: ${w.misc.speed}.`,
                source,
                questions: [
                    `What is the speed of ${w.meta.name}?`,
                    `${w.meta.name} speed?`,
                ],
                metadata,
            }

            questions.push(speed)
        }

        if (w.misc.speed) {
            const range: models.Question = {
                answer: `${w.meta.name} hax range ${w.misc.range}.`,
                source,
                questions: [
                    `What is the range of ${w.meta.name}?`,
                    `${w.meta.name} range?`,
                ],
                metadata,
            }

            questions.push(range)
        }

        return questions
    })

    const questions: models.Question[] = [
        ...questionsUpgrades,
        ...questionsWeapon,
    ]

    const kbModel: models.KnowledgeBaseCreate = {
        name: 'SC2 KB Questions from Balancedata',
        qnaList: questions,
    }

    return kbModel
}