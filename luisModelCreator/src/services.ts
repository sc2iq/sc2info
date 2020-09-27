import * as constants from './constants'
import * as luisTypes from './luisTypes'

export function createLuDownWithPhraseLists(luisIntentsWithUtterances: Record<string, string[]>): string {

    
// ${Object.entries(luisIntentsWithUtterances).map(([intentName, intentUtterances]) => `# ${intentName}
// ${intentUtterances.map(iu => `- ${iu}`).join(`\n`)}
// `).join(`\n`)}

// @ phraselist units(interchangeable) = 
//     - ${constants.units.map(unit => unit.toLowerCase()).join(',')}

// > @ phraselist Buildings(interchangeable) =
// > ${constants.buildings.map(building => `    - ${building.toLowerCase()}`).join('\n')}
// > 
// > @ phraselist Properties(interchangeable) =
// >     - cost,minerals,vespene

    return `
> LUIS application information
> !# @app.name = sc2info-bot
> !# @app.desc = Detect units, buildings, weapons, and more
> !# @app.versionId = 0.1
> !# @app.culture = en-us
> !# @app.luis_schema_version = 7.0.0
> !# @app.tokenizerVersion = 1.0.0

> # Intent definitions

## Question
- What is the mineral cost of a marine?

## None

> # Entity definitions

@ ml unit usesFeature units
@ ml building usesFeature buildings
@ ml weapon usesFeature weapons

> # PREBUILT Entity definitions

> # Phrase list definitions

@ phraselist units(interchangeable) = 
    - ${constants.units.map(unit => unit.toLowerCase()).join(',')}

@ phraselist buildings(interchangeable) = 
    - ${constants.buildings.map(building => building.toLowerCase()).join(',')}

@ phraselist weapons(interchangeable) = 
    - ${constants.weapons.map(weapon => weapon.toLowerCase()).join(',')}

> # List entities

> # RegEx entities
`
}

export function createLuisJsonWithPhraseLists(luisIntentsWithUtterances: Record<string, string[]>): Partial<luisTypes.LuisJsonRoot> {

    return {

    }
}


