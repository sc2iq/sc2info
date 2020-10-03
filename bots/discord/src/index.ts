import dotenv from 'dotenv'
import Discord from 'discord.js'
import commands from '@sc2/commands'
import { debugInfo, debugVerbose } from './debug'
import { splitCommandFromMessage, splitUsernameFromMessage } from './utilities'

dotenv.config()

async function main() {
    const client = new Discord.Client()
    
    debugInfo(`Sc2Info discord bot is running...`)
    
    client.on('ready', onReady)
    client.on("message", onMessage)
    
    client.login(process.env.DISCORD_BOT_TOKEN)
}

function onReady() {
    debugInfo('Sc2Info bot is ready!')
}

const botUsername = process.env.BOT_USERNAME!
const prefix = "!"
function onMessage(message: Discord.Message) {
    // If message is from yourself ignore
    if (message.author.bot) return

    // If message does not start with ! or @sc2info then ignore
    let commandName: string
    let commandContent: string

    const botUserNamePrefix = `@${botUsername}`

    if (message.content.startsWith(prefix)) {
        [commandName, commandContent] = splitCommandFromMessage(prefix, message.content)
    }
    else if(message.content.startsWith(botUserNamePrefix)) {
        [commandName, commandContent] = splitUsernameFromMessage(botUserNamePrefix, message.content)
    }
    else {
        return
    }

    debugVerbose(`Command: ${commandName}\nContent: ${commandContent}`)

    const commandFunc = commands[commandName]
    if (commandFunc === undefined) {
        return
    }

    const replyFunc = (s: string) => message.reply(s)
    commandFunc(replyFunc, commandContent)
}

main()