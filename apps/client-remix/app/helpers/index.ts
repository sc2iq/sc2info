import { XmlJsonElement, convertCamelCaseToSpacedCase } from "~/utilities"

type Race =
    | 'zerg'
    | 'terran'
    | 'protoss'
    | 'neutral'

const races: Race[] = ['zerg', 'terran', 'protoss']

export function getRaceFromString(s: string): Race {
    for (const race of races) {
        if (s.toLowerCase().includes(race)) {
            return race
        }
    }

    return 'neutral'
}

export function getNameIconRace(e: XmlJsonElement) {
    let id = parseInt(e.attributes?.id ?? '')
    if (Number.isNaN(id)) {
        id = -1
    }

    const metaAttributes = e.elements?.find(e => e.name === 'meta')?.attributes ?? {}
    const name = e.attributes?.id ?? ''
    const icon = metaAttributes.icon ?? ''
    const race = getRaceFromString(icon)

    return {
        id,
        name,
        icon,
        race,
    }
}