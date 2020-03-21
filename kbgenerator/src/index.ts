import * as dotenv from 'dotenv'
import * as models from './models'
import KbApi from './kbApi'
import KbRuntimeApi from './kbRuntimeApi';
import fs from 'fs'
import kbGenerator from './generator'
import { ICategorizedUnits } from '@sc2/convertbalancedata';
import generateKnowledgeBase from './generator';

dotenv.config()

const subscriptionKey = process.env.QNA_SUBSCRIPTION_KEY
const endpointKey = process.env.QNA_ENDPOINT_KEY

const kbUpdate: models.KnowledgeBaseUpdate = {
    add: {
        qnaList: [
            {
                answer: "You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle",
                source: "Custom Editorial",
                questions: [
                    "How can I change the default message from QnA Maker?"
                ],
                metadata: []
            },
            {
                answer: "My Answer",
                source: "Some Source",
                questions: [
                    "Why does this fail?"
                ],
                metadata: [
                    {
                        name: "metadataName",
                        value: "metadataValue"
                    }
                ]
            },
            {
                answer: "45",
                source: "Some Source",
                questions: [
                    "How much health does a Marine have?"
                ],
                metadata: [
                    {
                        name: "race",
                        value: "terran"
                    },
                    {
                        name: "pending",
                        value: "true"
                    }
                ]
            }
        ],
    },
}

const query: models.GenerateAnswerInput = {
    question: "How much health does marine have?",
    top: 2,
    isTest: true,
    scoreThreshold: 20,
    strictFilters: [
    ],
    userId: "sd53lsY="
}

async function main() {
    const balanceDataFile = await fs.promises.readFile('balancedata.json', 'utf8')
    const balanceDataJson: ICategorizedUnits = JSON.parse(balanceDataFile)

    const knowledgeBase = generateKnowledgeBase(balanceDataJson)

    if (!subscriptionKey) {
        throw new Error(`Subscription key is not defined!`)
    }

    if (!endpointKey) {
        throw new Error(`Endpoint key is not defined!`)
    }

    const kbApi = new KbApi(subscriptionKey)
    const kbRuntimeApi = new KbRuntimeApi(endpointKey)
    try {
        const createResponse = await kbApi.create(knowledgeBase)
        const createOperationStatus = await kbApi.resolveOperation(createResponse.data.operationId)

        const knowledgeBaseId = createOperationStatus.resourceLocation.split('/')[2]
        const kbResponse = await kbApi.get(knowledgeBaseId)
        console.log({ kbResponse })

        const updateResponse = await kbApi.update(knowledgeBaseId, kbUpdate)
        const updateOperationStatus = await kbApi.resolveOperation(updateResponse.data.operationId)
        console.log({ updateOperationStatus })

        const knowledgeBaseQuestions = await kbApi.download(knowledgeBaseId, "Test")
        console.log({ knowledgeBaseQuestions })

        const trainResponse = await kbRuntimeApi.train(knowledgeBaseId)
        console.log({ trainResponse })

        const publishResponse = await kbApi.publish(knowledgeBaseId)
        console.log({ publishResponse })

        const answerResponse = await kbRuntimeApi.generateAnswer(knowledgeBaseId, query)
        console.log({ answerResponse })
    }
    catch (e) {
        const error: Error = e
        console.log({ error })
        process.exit(1)
    }
}

main()

