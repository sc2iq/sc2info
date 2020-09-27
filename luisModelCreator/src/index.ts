import dotenv from 'dotenv'
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js"
import { LUISAuthoringClient } from "@azure/cognitiveservices-luis-authoring"
import { createLuDownWithPhraseLists } from './services'
import * as fs from 'fs'

process.on('unhandledRejection', (reason) => {
    throw reason
})

dotenv.config()

const authoringKey = process.env.LUIS_AUTHORING_KEY
const endpointUrl = process.env.ENDPOINT_URL

async function main() {
    if (!authoringKey) {
        throw new Error(`LUIS Authoring key was not set.`)
    }
    if (!endpointUrl) {
        throw new Error(`Endpoint url for LUIS account was not set`)
    }

    const creds = new CognitiveServicesCredentials(authoringKey)
    const client = new LUISAuthoringClient(creds, endpointUrl)

    // const inputFile = 'sc2info-bot.lu'
    // console.log(`Reading ${inputFile}...`)
    // const luDownString = await fs.promises.readFile(inputFile, 'utf8')

    // console.log(`Importing App from LU Down string...`)
    // const result = await client.apps.importLuFormat(luDownString, { appName: `sc2iq-${Math.floor(Math.random() * 100)}` })
    // const modelId = result.body
    // const modelUrl = `https://www.luis.ai/conversations/applications/${modelId}/versions/0.1/build/intents`

    console.log(`Creating LU Down string...`)
    const luDownString = createLuDownWithPhraseLists({})
    // const luisJsonString = createLuisJsonWithPhraseLists({})
    const fileName = `sc2info-bot-phrase-lists.lu`
    await fs.promises.writeFile(fileName, luDownString)
    console.log(`Write file ${fileName}`)

    const result = await client.apps.importLuFormat(luDownString, { appName: `sc2iq-${Math.floor(Math.random() * 100)}` })
    const modelId = result.body
    const modelUrl = `https://www.luis.ai/conversations/applications/${modelId}/versions/0.1/build/intents`

    console.log(`Model Created!
    ID: ${modelId}
    URL: ${modelUrl}`)

    const training = await client.train.trainVersion(modelId, '0.1')
    console.log(`${training.status ?? `NoStatusError`} Training for model: ${modelId}`)
}

main()