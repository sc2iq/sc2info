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

async function main() {
    const balanceDataFile = await fs.promises.readFile('balancedata.json', 'utf8')
    const balanceDataJson: ICategorizedUnits = JSON.parse(balanceDataFile)

    const questionInputs = generate(balanceDataJson)

    const fileName = `questionInputs.json`
    await fs.promises.writeFile(fileName, JSON.stringify(questionInputs, null, 4), '')
    console.log(`Generated ${questionInputs.length} questions.`)
    console.log(`Saved as ${fileName}.`)
}

main()

