import * as models from '../models'
import fetch, { Response } from "node-fetch"

const basedUrl = `http://localhost:3002`

// Test
export const getKey = async (): Promise<string> => {
    const response = await fetch(`${basedUrl}/test`)

    if (response.ok) {
        const responseData = await response.text()
        return responseData
    }

    throw new Error(`Error when attempting to get key.`)
}

// Questions
export const getQuestions = async (state?: models.sc2iq.QuestionState): Promise<models.sc2iq.Question[]> => {
    const path = `/questions${state ? `?state=${state}` : ''}`
    const response = await fetch(`${basedUrl}${path}`, {
        headers: {
            Accept: 'application/json',
        }
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to GET ${path}`)
}

export const getRandomQuestions = get<models.sc2iq.Question[]>('/questions/random')
export const getQuestion = getById<models.sc2iq.QuestionWithDetails>('/questions')
export const postQuestion = post<models.sc2iq.QuestionInput, models.sc2iq.Question>('/questions')

export const setQuestionState = async (token: string, questionId: string, state: models.sc2iq.QuestionState.APPROVED | models.sc2iq.QuestionState.REJECTED): Promise<models.sc2iq.Question> => {
    let subPath = state === models.sc2iq.QuestionState.APPROVED
        ? `approve`
        : `reject`

    const method = `PUT`
    const path = `/questions/${questionId}/${subPath}`
    const response = await fetch(`${basedUrl}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to ${method} ${path}.`)
}

export const postQuestionsSearch = async (search: models.sc2iq.Search): Promise<models.sc2iq.Question[]> => {
    const path = `/questions/search`
    const response = await fetch(`${basedUrl}${path}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(search),
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to POST ${path}.`)
}

// Polls
export const getPolls = async (state?: models.sc2iq.PollState): Promise<models.sc2iq.Poll[]> => {
    const path = `/polls${state ? `?state=${state}` : ''}`
    const response = await fetch(`${basedUrl}${path}`, {
        headers: {
            Accept: 'application/json',
        }
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to GET ${path}`)
}

export const getPoll = getById<models.sc2iq.PollWithDetails>('/polls')
export const postPoll = post<models.sc2iq.PollInput, models.sc2iq.Poll>('/polls')
export const postPollsSearch = async (search: models.sc2iq.Search): Promise<models.sc2iq.Poll[]> => {
    const path = `/polls/search`
    const response = await fetch(`${basedUrl}${path}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(search),
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to POST ${path}.`)
}

export const setPollState = async (token: string, pollId: string, state: models.sc2iq.PollState.APPROVED | models.sc2iq.PollState.REJECTED): Promise<models.sc2iq.Poll> => {
    let subPath = state === models.sc2iq.PollState.APPROVED
        ? `approve`
        : `reject`

    const method = `PUT`
    const path = `/polls/${pollId}/${subPath}`
    const response = await fetch(`${basedUrl}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to ${method} ${path}.`)
}

// Scores
export const getScores = get<models.sc2iq.Score[]>('/scores')
export const getScore = getById<models.sc2iq.Score>('/scores')
export const postScore = post<models.sc2iq.ScoreInput, models.sc2iq.Score>('/scores')

// Users
export const getUsers = get<models.sc2iq.User[]>('/users')
export const getUser = getById<models.sc2iq.User>('/users')
export const postUser = post<models.sc2iq.UserInput, models.sc2iq.User>('/users')

// Profile
export const verify = getWithToken<models.sc2iq.AccessToken>('/verify')
export const getUserInfo = async (token: string) => {
    const response = await fetch(`https://sc2iq.auth0.com/userinfo`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    if (response.ok) {
        const responseData = await response.json()
        return responseData
    }

    throw new Error(`Error when attempting to get user info.`)
}


function getById<T>(subPath: string) {
    return async function fn(id: string): Promise<T> {
        const path = `${subPath}/${id}`
        const response = await fetch(`${basedUrl}${path}`, {
            headers: {
                Accept: 'application/json',
            }
        })

        return returnJson(response)
    }
}

function get<T>(path: string) {
    return async function fn(): Promise<T> {
        const response = await fetch(`${basedUrl}${path}`, {
            headers: {
                Accept: 'application/json',
            }
        })

        return returnJson(response)
    }
}

function getWithToken<T>(path: string) {
    return async function fn(token: string): Promise<T> {
        return fetchPath<T>(path, token)
    }
}

function post<Input, Output>(path: string) {
    return async function (token: string, input: Input): Promise<Output> {
        const response = await fetch(`${basedUrl}${path}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })

        if (response.ok) {
            const responseData = await response.json()
            return responseData
        }

        throw new Error(`Error when attempting to POST ${path}.`)
    }
}

async function fetchPath<T>(path: string, token: string): Promise<T> {
    const response = await fetch(`${basedUrl}${path}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })

    return returnJson(response)
}

async function returnJson<T>(response: Response): Promise<T> {
    if (response.ok) {
        const responseData = await response.json()
        return responseData as T
    }

    throw new Error(`Error when attempting to: ${response.url}`)
}