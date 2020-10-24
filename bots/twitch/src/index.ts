import dotenv from 'dotenv'
import tmi from 'tmi.js'
import commands from '@sc2/commands'
import { debugInfo, debugVerbose } from './debug'
import { splitCommandFromMessage, splitUsernameFromMessage } from './utilities'

dotenv.config()

const DEBUG = !!process.env.DEBUG_TMI
const channelsString = process.env.CHANNEL_NAMES ?? ''
const channels = channelsString.split(',').map(s => s.trim().toLowerCase())
debugInfo(`Channels: ${channels.join(', ')}`)

const botUsername = process.env.BOT_USERNAME!
const tmiOptions: tmi.Options = {
    identity: {
        username: botUsername,
        password: process.env.OAUTH_TOKEN!
    },
    channels,
    options: {
        debug: DEBUG
    }
}

async function main() {
    const client: tmi.Client = new (tmi.client as any)(tmiOptions)

    debugInfo(`Sc2Info Twitch Bot is running...`)
    debugInfo(`TMI DEBUG option is ${DEBUG ? 'enabled' : 'disabled'}`)

    const onMessageWithClient = onMessage(client)
    client.on('message', onMessageWithClient)
    client.on('action', onMessageWithClient)
    // client.on('cheer', onMessageHandler(client))
    client.on('connecting', onConnected)
    client.on('connected', onConnected)
    client.on('hosted', onHosted)
    client.on('hosting', onHosting)
    client.on('join', onJoin)
    client.on('notice', onNotice)

    client.connect()
}

const prefix = "!"
function onMessage(client: tmi.Client) {
    return (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean) => {
        // If message is from self disregard
        if (self) return

        // If message does not start with ! or @sc2info then ignore
        let commandName: string
        let commandContent: string

        const botUserNamePrefix = `@${botUsername}`

        if (message.startsWith(prefix)) {
            [commandName, commandContent] = splitCommandFromMessage(prefix, message)
        }
        else if(message.startsWith(botUserNamePrefix)) {
            [commandName, commandContent] = splitUsernameFromMessage(botUserNamePrefix, message)
        }
        else {
            return
        }

        debugVerbose(`Command: ${commandName}\nContent: ${commandContent}`)

        const commandFunc = commands[commandName]
        if (commandFunc === undefined) {
            debugVerbose(`Command ${commandName} not found!`)
            return
        }

        const replyFn = (response: string) => client.say(channel, response)
        try {
            commandFunc(replyFn, commandContent)
        }
        catch (err) {
            const error: Error = err

            if (DEBUG) {
                client.say(channel, error.message)
            }
        }
    }
}

function onHosted(channel: string, username: string, viewers: number, autohost: boolean) {
    debugVerbose(`onHosted`, { channel, username, viewers, autohost })
}

function onHosting(channel: string, target: string, viewers: number) {
    debugVerbose(`onHosting`, { channel, target, viewers, })
}

function onJoin(channel: string, username: string, self: boolean) {
    debugInfo('Sc2Info bot has joined the channel: ', { channel, username, self, })
}

function onNotice(channel: string, messageId: string, message: string) {
    debugVerbose(`onNotice`, { channel, messageId, message, })
}

// Called every time the bot connects to Twitch chat
function onConnected(addr: string, port: number) {
    debugVerbose(`* Connected to ${addr}:${port}`)
}

main()