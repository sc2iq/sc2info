import dotenv from 'dotenv'
import Discord from 'discord.js'
import commands from '@sc2/commands'
import { debugInfo, debugVerbose } from './debug'
import { splitCommandFromMessage } from './utilities'

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

const prefix = "!"
function onMessage(message: Discord.Message) {
    // If message is from yourself ignore
    if (message.author.bot) return

    // If message does not start with ! then ignore
    if (!message.content.startsWith(prefix)) return

    const [command, commandContent] = splitCommandFromMessage(prefix, message.content)
    debugVerbose(`Command: ${command}\nContent: ${commandContent}`)

    const commandFunc = commands[command]
    if (commandFunc === undefined) {
        return
    }

    const replyFunc = (s: string) => message.reply(s)
    commandFunc(replyFunc, commandContent)
}

main()