export function splitCommandFromMessage(prefix: string, message: string): [command: string, messageWithoutCommand: string] {
    const commandWithoutPrefix = message.slice(prefix.length)
    const words = commandWithoutPrefix.split(' ')
    const [firstWord, ...otherWords] = words
    const command = firstWord.toLowerCase()
    const commandContent = otherWords.join(' ')

    return [
        command,
        commandContent
    ]
}