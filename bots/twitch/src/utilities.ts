export function splitCommandFromMessage(prefix: string, message: string): [command: string, messageWithoutCommand: string] {
    const commandWithoutPrefix = message.slice(prefix.length)
    const words = commandWithoutPrefix.split(' ').filter(s => s.length > 0)
    const [firstWord, ...otherWords] = words
    const command = firstWord.toLowerCase()
    const commandContent = otherWords.join(' ')

    return [
        command,
        commandContent
    ]
}

export function splitUsernameFromMessage(prefix: string, message: string): [command: string, messageWithoutCommand: string] {
    const commandWithoutPrefix = message.slice(prefix.length)
    const words = commandWithoutPrefix.split(' ').filter(s => s.length > 0)

    const command = 'q'
    const commandContent = words.join(' ')

    return [
        command,
        commandContent,
    ]
}