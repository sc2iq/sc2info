import * as sc2iq from './sc2iq'
import * as qna from './qna'

export {
    sc2iq,
    qna
}

export type GenerateResult = {
    luisEntities: string[]
    luisIntentsWithUtterances: Record<string, string[]>
    sc2iqQuestions: sc2iq.QuestionInput[]
    kbQuestions: qna.Question[]
}