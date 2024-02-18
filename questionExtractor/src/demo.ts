import dotenv from 'dotenv'
import extractSc2Info from './index'

dotenv.config()

const unitQuestions = [
    `How much health does a marine have?`,
    `How much damage does a colossi do?`,
]

const buildingQuestions = [
    `How much does a barracks cost?`,
]

const weaponQuestions = [
    `What is the damage of the GuassRifle?`
]

const nonQuestionInputs = [
    'Hey',
    '',
    'type',
    'I love starcraft',
]

const questions = [
    ...unitQuestions,
    ...buildingQuestions,
    ...weaponQuestions,
    ...nonQuestionInputs
]

async function main() {
    const extractionsForDisplay: any = []

    for (const question of questions) {
        const extraction = await extractSc2Info(question)
        if (extraction == undefined) {
            continue
        }

        extractionsForDisplay.push(extraction)

        const presentedAnswer = `
Question:
${extraction.message}

Answer:
${extraction.answer}
            `

        console.log(presentedAnswer)
    }

    // console.log(JSON.stringify(extractionsForDisplay, null, 4))
}

main()

