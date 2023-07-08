import { createMachine } from 'xstate'

const uploadStatusMachine = createMachine({
    id: 'toggle',
    initial: 'inactive',
    states: {
        inactive: {
            on: { TOGGLE: 'active' },
        },
        active: {
            on: { TOGGLE: 'inactive' },
        },
    },
})

export { uploadStatusMachine }