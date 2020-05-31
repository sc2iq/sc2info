import * as dotenv from 'dotenv'
import auth0 from "auth0"
import * as models from './models'
import * as client from './services/client'

import fs from 'fs'
import questionGenerator from './generator/generator'
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

const dryRun = true

async function main() {
    const balanceDataFile = await fs.promises.readFile('balancedata.json', 'utf8')
    const balanceDataJson: ICategorizedUnits = JSON.parse(balanceDataFile)

    const questionInputs = generate(balanceDataJson)

    await fs.promises.writeFile(`questionInputs.json`, JSON.stringify(questionInputs, null, 4), '')
    console.log(`Generated ${questionInputs.length} Questions`, { questionInputs })

    if (dryRun) {
        return
    }

    try {
        const tokenResponse = await authenticationClient.clientCredentialsGrant({ audience: 'https://sc2iq.com/api' })

        for (const questionInput of questionInputs) {
            const savedQuestion = await client.postQuestion(tokenResponse.access_token, questionInput)
            console.log(`Saved Question: ${savedQuestion.id} ${Date.now()}`)
        }
    }
    catch (e) {
        const error: Error = e
        console.log({ error })
        process.exit(1)
    }
}

main()

