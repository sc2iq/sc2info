
export function getNumberVariances(n: number): [number, number, number, number] {
    let answer1 = n
    let answer2: number
    let answer3: number
    let answer4: number

    // If small and fractional
    if (answer1 < 4 && Math.round(answer1) !== answer1) {
        answer2 = answer1 / 2
        answer3 = answer1 + 1
        answer4 = answer1 * 2
    }
    else if (answer1 < 15) {
        answer2 = answer1 - 1
        answer3 = answer1 + 1
        answer4 = answer1 + 2
    }
    else if (answer1 < 100) {
        answer2 = answer1 - 5
        answer3 = answer1 + 5
        answer4 = answer1 + 10
    }
    else if (answer1 < 200) {
        answer2 = answer1 - 5
        answer3 = answer1 + 5
        answer4 = answer1 + 10
    }
    else if (answer1 < 300) {
        answer2 = answer1 - 10
        answer3 = answer1 + 10
        answer4 = answer1 + 20
    }
    else {
        answer2 = answer1 - 20
        answer3 = answer1 + 20
        answer4 = answer1 + 30
    }

    return [
        answer1,
        answer2,
        answer3,
        answer4,
    ]
}

const regex = /([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g
export function camelCaseToNormal(s: string): string {
    return s.replace(regex, '$& ')
}

export function getRandomValue<T>(values: T[]): T {
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
}

type Race = "terran" | "zerg" | "protoss"
const races: Race[] = ["terran", "zerg", "protoss"]

export function getRaceFromName(name: string): Race | undefined {
    const lowerName = name.toLowerCase()

    for (const race of races) {
        if (lowerName.includes(race)) {
            return race
        }
    }
}

const attributes = [
    "Psionic",
    "Massive",
    "Armored",
    "Mechanical",
    "Structure",
    "Biological",
    "Light",
]

const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
const vowelSoundingWords: string[] = [
]

const constantSoundingWords: string[] = [
]

export function getPrecedingArticle(word: string): "a" | "an" {
    if (vowelSoundingWords.includes(word.toLowerCase())) {
        return "an"
    }
    else if (constantSoundingWords.includes(word.toLowerCase())) {
        return "a"
    }

    if (vowels.includes(word[0].toLowerCase())) {
        return "an"
    }

    return "a"
}

export function getOtherAttributes(attribute: string): [string, string, string, string] {
    const answers: string[] = [
        attribute
    ]

    for (let i = 0; i < 4; i++) {
        let answer: string | undefined
        while (answer !== attribute) {
            answer = getRandomValue(attributes)
        }

        answers.push(answer)
    }

    return answers as [string, string, string, string]
}