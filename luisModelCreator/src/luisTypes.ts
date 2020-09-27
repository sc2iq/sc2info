export type LuisJsonIntent = {
    name: string
    features: any[]
}

export type LuisJsonEntity = {
    name: string
    children: LuisJsonEntity[]
    roles: string[]
    features: string[]
}

export type LuisJsonUtteranceReference = {
    entity: string
    startPos: number
    endPos: number
    children: LuisJsonUtteranceReference[]
}

export type LuisJsonUtterance = {
    text: string
    intent: string
    entities: LuisJsonUtteranceReference[]
}

export type LuisJsonRoot = {
    luis_schema_version: string
    intents: LuisJsonIntent[]
    entities: LuisJsonEntity[]
    hierarchicals: []
    composites: []
    closedLists: []
    prebuiltEntities: []
    utterances: LuisJsonUtterance[]
    versionId: string
    name: string
    desc: string
    culture: "en-us"
    tokenizerVersion: "1.0.0"
    patternAnyEntities: []
    regex_entities: []
    phraselists: []
    regex_features: []
    patterns: []
    settings: []
}
