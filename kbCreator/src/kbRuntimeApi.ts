import axios, { AxiosResponse } from 'axios'
import * as models from './models'

const host = 'https://sc2iq-qna.azurewebsites.net'
const service = '/qnamaker'

export default class KbRuntimeApi {
    constructor(private endpointKey: string) {
    }

    async train(knowledgeBaseId: string, feedBackRecords: models.FeedbackRedord[] = []) {
        const url = `${host}${service}/knowledgebases/${knowledgeBaseId}/train`
        const response = await axios.post(url, { feedBackRecords }, {
            headers: {
                'Authorization': `EndpointKey ${this.endpointKey}`,
                'Content-Type': 'application/json',
            },
        })

        return response
    }

    async generateAnswer(knowledgeBaseId: string, query: models.GenerateAnswerInput) {
        const url = `${host}${service}/knowledgebases/${knowledgeBaseId}/generateAnswer`
        const response = await axios.post<models.GenerateAnswerInput, AxiosResponse<models.QenerateAnswerOutput>>(url, query, {
            headers: {
                'Authorization': `EndpointKey ${this.endpointKey}`,
                'Content-Type': 'application/json',
            },
        })

        return response.data
    }
}
