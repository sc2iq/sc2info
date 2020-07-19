export function createLudownContentString(
    luisEntities: string[],
    luisIntentsWithUtterances: Record<string, string[]>
): string {
    return `
> LUIS application information
> !# @app.name = sc2info-bot
> !# @app.desc = Detect units, buildings, weapons, and more
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 7.0.0
> !# @app.tokenizerVersion = 1.0.0

> # Intent definitions
${Object.entries(luisIntentsWithUtterances).map(([intentName, intentUtterances]) => `# ${intentName}
${intentUtterances.map(iu => `- ${iu}`).join(`\n`)}
`).join(`\n`)}

> # Entity definitions
${luisEntities.map(le => `@ ml "${le}"`).join('\n\n')}

> # PREBUILT Entity definitions

> # Phrase list definitions

> # List entities

> # RegEx entities
`
}