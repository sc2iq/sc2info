const regex = /([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g
export function convertCamelCaseToSpacedCase(camelCaseString: string): string {
    return camelCaseString.replace(regex, '$& ')
}

let enabled = true
export function throttle<T extends Function>(fn: T, timeMs: number): any {
    return (...args: any[]) => {
        if (enabled) {
            // Prevent future calls until enabled
            enabled = false
            // Re-enable after time out
            setTimeout(() => { enabled = true }, timeMs)
            // Call fn
            return fn(args)
        }
    }
}

export interface IMatchSegement {
    text: string
    startIndex: number
    endIndex: number
    matched: boolean
}

/**
 * This works by dividing the input text into segments by the match indicies
 * Initially the input is a single unmatched segment, for every match we split the segments into parts.
 * 
 * Example
 * ```
 * input: harness real-time
 * 
 * 0         u
 *   'harness real-time'
 * 1   m           u
 *   'har' 'ness real-time'
 * 2   m    u       m
 *   'har' 'n' 'ess real-time'
 * 3   m    u    m       u
 *   'har' 'n' 'ess' 'real-time'
 * 4   m    u    m      u       m
 *   'har' 'n' 'ess' 'real-' 'time'
 * 
 */
// TODO: Change to single pass computation of slices based on indicies.
// All indicies must be greater than or equal, and non 0 length pairs
export const convertMatchedTextIntoMatchedSegements = <T>(inputText: string, matches: [number, number][]): IMatchSegement[] => {
    const initialSegments: IMatchSegement[] = [
        {
            text: inputText,
            startIndex: 0,
            endIndex: inputText.length,
            matched: false,
        }
    ]

    const matchedStrings = matches.reduce<IMatchSegement[]>((segements, [startIndex, originalEndIndex]) => {
        // TODO: For some reason the Fuse.io library returns the end index before the last character instead of after
        // I opened issue here for explanation: https://github.com/krisk/Fuse/issues/212
        const endIndex = originalEndIndex + 1
        const segementIndexWhereEntityBelongs = segements.findIndex(seg => seg.startIndex <= startIndex && endIndex <= seg.endIndex)
        const prevSegements = segements.slice(0, segementIndexWhereEntityBelongs)
        const nextSegements = segements.slice(segementIndexWhereEntityBelongs + 1, segements.length)
        const segementWhereEntityBelongs = segements[segementIndexWhereEntityBelongs]

        const prevSegementEndIndex = startIndex - segementWhereEntityBelongs.startIndex
        const prevSegementText = segementWhereEntityBelongs.text.substring(0, prevSegementEndIndex)
        const prevSegement: IMatchSegement = {
            ...segementWhereEntityBelongs,
            text: prevSegementText,
            endIndex: startIndex,
        }

        const nextSegementStartIndex = endIndex - segementWhereEntityBelongs.startIndex
        const nextSegementText = segementWhereEntityBelongs.text.substring(nextSegementStartIndex, segementWhereEntityBelongs.text.length)
        const nextSegement: IMatchSegement = {
            ...segementWhereEntityBelongs,
            text: nextSegementText,
            startIndex: endIndex,
        }

        const newSegement: IMatchSegement = {
            text: segementWhereEntityBelongs.text.substring(prevSegementEndIndex, nextSegementStartIndex),
            startIndex: startIndex,
            endIndex: endIndex,
            matched: true,
        }

        const newSegements = []
        if (prevSegement.startIndex !== prevSegement.endIndex) {
            newSegements.push(prevSegement)
        }

        if (newSegement.startIndex !== newSegement.endIndex) {
            newSegements.push(newSegement)
        }

        if (nextSegement.startIndex !== nextSegement.endIndex) {
            newSegements.push(nextSegement)
        }

        return [...prevSegements, ...newSegements, ...nextSegements]
    }, initialSegments)

    return matchedStrings
}