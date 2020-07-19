import * as dotenv from 'dotenv'
import auth0 from "auth0"
import fs from 'fs'
import { ICategorizedUnits } from '@sc2/convertbalancedata'
import generate from './generator/generator'

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
    const luisLudownContent: string = `
> LUIS application information
> !# @app.name = sc2info-bot
> !# @app.desc = Detect units, buildings, weapons, and more
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 7.0.0
> !# @app.tokenizerVersion = 1.0.0

> # Intent definitions
${Object.entries(generateResult.luisIntentsWithUtterances).map(([intentName, intentUtterances]) =>
        `# ${intentName}
${intentUtterances.map(iu => `- ${iu}`).join(`\n`)}
`).join(`\n`)}

> # Entity definitions
${generateResult.luisEntities.map(le => `@ ml "${le}"`).join('\n\n')}

> # PREBUILT Entity definitions

> # Phrase list definitions

> # List entities

> # RegEx entities
`

    const luDownFileName = `sc2info-bot.lu`
    await fs.promises.writeFile(luDownFileName, luisLudownContent)
    console.log(`
Generated:
${Object.keys(generateResult.luisIntentsWithUtterances).length} intents,
${Object.values(generateResult.luisIntentsWithUtterances).flat().length} utterances,
${generateResult.luisEntities.length} entities,

Saved as '${luDownFileName}'.
`)

    // Generate question inputs file
    const questionInputs = generateResult.questions
    questionInputs.forEach(q => q.id = q.id?.toLowerCase())
    const questionInputsFileName = `questionInputs.json`
    await fs.promises.writeFile(questionInputsFileName, JSON.stringify(questionInputs, null, 4))
    console.log(`
Generated ${questionInputs.length} questions.

Saved as '${questionInputsFileName}'.
`)
}

main()

