import global from './global/typeDefs'
import abilities from './abilities/typeDefs'
import attributes from './attributes/typeDefs'
import buildings from './buildings/typeDefs'
import upgrades from './upgrades/typeDefs'
import weapons from './weapons/typeDefs'
import units from './units/typeDefs'
import searchAll from './searchAll/typeDefs'
import * as pagination from './pagination'

const typeDefs = [
    ...global,
    abilities,
    attributes,
    buildings,
    upgrades,
    weapons,
    units,
    pagination.typeDefs,
    searchAll,
]

export default typeDefs