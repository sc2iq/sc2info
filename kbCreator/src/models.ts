export type KnowledgeBase = {
    id: string,
    hostName: string,
    lastAccessedTimestamp: string,
    lastChangedTimestamp: string,
    lastPublishedTimestamp: string,
    name: string,
    userId: string,
    urls: string[],
    sources: string[]
}

export type KnowledgeBasesOutput = {
    knowledgeBases: KnowledgeBase[]
}

type KnowledgeBaseDetail = {
    id: number,
    answer: string,
    source: string,
    questions: string[],
    metadata: NameValue[],
    alternateQuestions: string,
    alternateQuestionClusters: [],
    changeStatus: string,
    kbId: string,
    context: {
        isContextOnly:  boolean,
        prompts: string[]
    }
}

export type KnowledgeBaseQuestions = {
    qnaDocuments: KnowledgeBaseDetail[]
}

export type Question = {
    id?: number
    answer: string
    source: string
    questions: string[]
    metadata: NameValue[]
}

export interface KnowledgeBaseCreate {
    name: string
    qnaList: Question[]
    url?: string[]
    files?: string[]
}

export interface KnowledgeBaseUpdate {
    add: {
        qnaList: Question[]
    }
}

export enum OperationState {
    Failed = 'Failed',
    Succeeded = 'Succeeded',
}

type NameValue = {
    name: string,
    value: string
}

export type GenerateAnswerInput = {
    question: string,
    top: number,
    isTest: boolean,
    scoreThreshold: number,
    strictFilters: NameValue[],
    userId: string
}

type QenerateAnswerAnswer = {
    score: number,
    id: number,
    answer: string,
    source: string,
    questions: string[],
    metadata: NameValue[]
}

export type QenerateAnswerOutput = {
    answers: QenerateAnswerAnswer[]
}

export type FeedbackRedord = {
    userId: string,
    userQuestion: string,
    qnaId: 4
}