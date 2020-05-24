import { buildSchemaSync } from "type-graphql"
import { AbilitiesResolver } from "./abilities/abilities"
import { AttributesResolver } from "./attributes/attributes"
import { BuildingResolver } from "./buildings/buildings"
import { SearchAllResolver } from "./searchAll/searchAll"
import { UnitsResolver } from "./units/units"
import { WeaponsResolver } from "./weapons/weapon"
import { UpgradesResolver } from "./upgrades/upgrades"

const schema = buildSchemaSync({
  resolvers: [
    AbilitiesResolver,
    AttributesResolver,
    BuildingResolver,
    SearchAllResolver,
    UnitsResolver,
    WeaponsResolver,
    UpgradesResolver,
  ],
  emitSchemaFile: true
})

export default schema