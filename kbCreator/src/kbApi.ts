import axios, { AxiosResponse } from 'axios'
import * as util from './utilities'
import * as models from './models'

const host = 'https://westus.api.cognitive.microsoft.com'
const service = '/qnamaker/v4.0'

export default class KbApi {
    constructor(private subscriptionKey: string) {
    }

    async getAll() {
        const kbUrl = `${host}${service}/knowledgebases`
        const kbResponse = await axios.get<any, AxiosResponse<models.KnowledgeBasesOutput>>(kbUrl, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return kbResponse.data
    }

    async get(knowledgeBaseId: string) {
        const kbUrl = `${host}${service}/knowledgebases/${knowledgeBaseId}`
        const kbResponse = await axios.get(kbUrl, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })
        return kbResponse
    }

    async create(kbModel: models.KnowledgeBaseCreate) {
        const url = `${host}${service}/knowledgebases/create`
        const response = await axios.post(url, kbModel, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return response
    }

    async update(knowledgeBaseId: string, kbUpdate: unknown) {
        const url = `${host}${service}/knowledgebases/${knowledgeBaseId}`
        const response = await axios.patch(url, kbUpdate, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return response
    }

    async download(knowledgeBaseId: string, environment: "Test" | "Prod") {
        const url = `${host}${service}/knowledgebases/${knowledgeBaseId}/${environment}/qna`
        const response = await axios.get<any, AxiosResponse<models.KnowledgeBaseQuestions>>(url, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return response.data
    }


    async publish(knowledgeBaseId: string) {
        const url = `${host}${service}/knowledgebases/${knowledgeBaseId}`
        const response = await axios.post(url, undefined, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return response
    }

    async resolveOperation(operationId: string) {
        let operationStatus = {} as any
        while (operationStatus.operationState !== models.OperationState.Succeeded) {
            operationStatus = await this.checkStatus(operationId)

            if (operationStatus.operationState === models.OperationState.Failed) {
                throw new Error(JSON.stringify(operationStatus.errorResponse, null, '  '))
            }
            else if (operationStatus.operationState === models.OperationState.Succeeded) {
                break
            }

            await util.delay(2000)
        }

        return operationStatus
    }

    private async checkStatus(operationId: string) {
        const url = `${host}${service}/operations/${operationId}`
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            },
        })

        return response.data
    }
}
