import * as dotenv from 'dotenv'
import auth0 from "auth0"
import fs from 'fs'
import { ICategorizedUnits } from '@sc2/convertbalancedata'
import generate from './generator/generator'
import * as models from './models'
import { createLudownContentString } from './services/ludown'

process.on('unhandledRejection', (reason) => {
    throw reason
})

const result = dotenv.config()
if (result.error) {
    throw result.error
}

const authenticationClient = new auth0.AuthenticationClient({
    domain: process.env.DOMAIN!,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

async function main() {
    const inputFileName = 'balancedata.4.12.1.json'
    console.log(`Reading file ${inputFileName} ...`)
    const balanceDataFile = await fs.promises.readFile(inputFileName, 'utf8')
    const balanceDataJson: ICategorizedUnits = JSON.parse(balanceDataFile)
    const generateResult = generate(balanceDataJson)

    // Generate LU Down file
    const luisLudownContent: string = createLudownContentString(generateResult.luisEntities, generateResult.luisIntentsWithUtterances)
    const luDownFileName = `sc2info-bot.lu`
    await fs.promises.writeFile(luDownFileName, luisLudownContent)
    console.log(`
Generated:
${Object.keys(generateResult.luisIntentsWithUtterances).length} intents,
${Object.values(generateResult.luisIntentsWithUtterances).flat().length} utterances,
${generateResult.luisEntities.length} entities,

Saved as '${luDownFileName}'.
`)

    // Generate QnA KnowledgeBase question inputs file
    const kbQuestionFileName = `qnaKnowledgeBase.json`
    const kbModel: models.qna.KnowledgeBaseCreate = {
        name: 'SC2 KB Questions from Balancedata',
        qnaList: generateResult.kbQuestions,
    }
    
    await fs.promises.writeFile(kbQuestionFileName, JSON.stringify(kbModel, null, 4))
    console.log(`
Generated ${generateResult.kbQuestions.length} QnA Knowledge Base questions.

Saved as '${kbQuestionFileName}'.
`)

    // Generate question inputs file
    const questionInputs = generateResult.sc2iqQuestions
    questionInputs.forEach(q => q.id = q.id?.toLowerCase())
    const questionInputsFileName = `questionInputs.json`
    await fs.promises.writeFile(questionInputsFileName, JSON.stringify(questionInputs, null, 4))
    console.log(`
Generated ${questionInputs.length} questions.

Saved as '${questionInputsFileName}'.
`)
}

main()
