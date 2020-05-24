import { buildSchemaSync } from "type-graphql"
import { AbilitiesResolver } from "./models/abilities"
import { AttributesResolver } from "./models/attributes"
import { BuildingResolver } from "./models/buildings"
// import { SearchAllResolver } from "./models/searchAll"
// import { UnitsResolver } from "./models/units"
import { WeaponsResolver } from "./models/weapons"
import { UpgradesResolver } from "./models/upgrades"

const schema = buildSchemaSync({
  resolvers: [
    AbilitiesResolver,
    AttributesResolver,
    BuildingResolver,
    // SearchAllResolver,
    // UnitsResolver,
    WeaponsResolver,
    UpgradesResolver,
  ],
  emitSchemaFile: true
})

export default schema