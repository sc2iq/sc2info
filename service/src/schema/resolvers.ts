import merge from 'lodash/merge'
import abilities from './abilities/resolvers'
import attributes from './attributes/resolvers'
import buildings from './buildings/resolvers'
import upgrades from './upgrades/resolvers'
import weapons from './weapons/resolvers'
import units from './units/resolvers'
import searchAll from './searchAll/resolvers'

const resolvers = merge(
    abilities,
    attributes,
    buildings,
    upgrades,
    weapons,
    units,
    searchAll,
)

export default resolvers