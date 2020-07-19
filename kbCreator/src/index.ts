import * as dotenv from 'dotenv'
import * as models from './models'
import KbApi from './kbApi'
import KbRuntimeApi from './kbRuntimeApi'
import fs from 'fs'

dotenv.config()

const subscriptionKey = process.env.QNA_SUBSCRIPTION_KEY
const endpointKey = process.env.QNA_ENDPOINT_KEY

async function main() {
    const qnqKnowledgeBaseString = await fs.promises.readFile('qnaKnowledgeBase.json', 'utf8')
    const knowledgeBase: models.KnowledgeBaseCreate = JSON.parse(qnqKnowledgeBaseString)

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

        // const updateResponse = await kbApi.update(knowledgeBaseId, kbUpdate)
        // const updateOperationStatus = await kbApi.resolveOperation(updateResponse.data.operationId)
        // console.log({ updateOperationStatus })

        const knowledgeBaseQuestions = await kbApi.download(knowledgeBaseId, "Test")
        console.log({ knowledgeBaseQuestions })

        const trainResponse = await kbRuntimeApi.train(knowledgeBaseId)
        console.log({ trainResponse })

        const publishResponse = await kbApi.publish(knowledgeBaseId)
        console.log({ publishResponse })

        const query: models.GenerateAnswerInput = {
            question: "How much health does marine have?",
            top: 2,
            isTest: true,
            scoreThreshold: 20,
            strictFilters: [
            ],
            userId: "sd53lsY="
        }
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

