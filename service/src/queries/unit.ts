import * as graphql from 'graphql'
import getBalanceData from '../balancedata'
import Unit from '../schema/unit'

export default {
    type: Unit,
    description: 'Unit in SC2',
    args: {
        id: { type: graphql.GraphQLInt },
    },
    async resolve(_: any, { id }: any) {
        const balanceData = await getBalanceData()
        const unit = balanceData.units.find(unit => unit.id === id)
        if (!unit) {
            throw new Error(`Not Found. Could not find unit with id matching: ${id}`)
        }

        if (unit.weapons && unit.weapons.length > 0 && typeof unit.weapons[0] === 'number') {
            const weaponUnits = (unit.weapons as number[])
                .map(unitId => balanceData.weapons.find(x => x.id === unitId))
                .filter(x => x)

            unit.weapons = weaponUnits
        }

        if (unit.upgrades && unit.upgrades.length > 0 && typeof unit.upgrades[0] === 'number') {
            const upgrades = (unit.upgrades as number[])
                .map(unitId => balanceData.upgrades.find(x => x.id === unitId))
                .filter(x => x)

            unit.upgrades = upgrades
        }

        return unit
    },
}
