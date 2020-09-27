import sc2extractor from '@sc2/extractor'
import { debugVerbose } from './debug'

/**
 * Alternate interface is for command to specify it's name and callback
 */
// interface Command {
//     name: string
//     callback: (client: any, channel: string, from: models.Context, message: string) => Promise<void>
// }

type ReplyFunc = (response: string) => void
type CommandProcessor = (reply: ReplyFunc, content: string) => Promise<void>

const help: CommandProcessor = async (reply) => {
    const response = `
Sc2Info Bot can help get info about Starcraft 2 units, buildings, weapons and more!

Try asking a question such as "How much does a barracks cost?"

Check out the website at: https://www.sc2info.com
`

    reply(response)
}

const question: CommandProcessor = async (reply, question: string) => {
    if (!(typeof question === 'string' && question.length > 0)) {
        return
    }

    const extraction = await sc2extractor(question)
    debugVerbose(`Question: ${question} Answer: ${JSON.stringify(extraction, null, 4)}`)

    if (extraction?.answer) {
        reply(extraction.answer)
    }
}

const availableCommands: CommandProcessor = async (reply) => {
    const response = `Sc2Info bot can respond to these commands: !q`

    reply(response)
}

const website : CommandProcessor = async (reply) => {
    const response = `https://www.sc2info.com`

    reply(response)
}

export const commands: Record<string, CommandProcessor> = {
    'h': help,
    'help': help,
    'site': website,
    'website': website,
    'commands': availableCommands,
    'q': question,
    'question': question,
}

export default commands