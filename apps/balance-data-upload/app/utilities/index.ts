export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function getRandomSequence(): string {
    // Create a byte array
    const bytes = new Uint8Array(16)

    // Fill it with random values
    crypto.getRandomValues(bytes)

    // Convert it to hexadecimal
    const hex = Array.from(bytes, byte => ('0' + byte.toString(16)).slice(-2)).join('')

    return hex
}