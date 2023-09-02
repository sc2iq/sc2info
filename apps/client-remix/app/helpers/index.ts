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