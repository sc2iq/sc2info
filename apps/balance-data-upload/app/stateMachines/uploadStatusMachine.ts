import { createMachine } from 'xstate'

const uploadStatusMachine = createMachine({
    id: 'uploadmachine',
    initial: 'inactive',
    states: {
        inactive: {
            on: { UPLOAD: 'Uploading' },
        },
        Uploading: {
            on: { PROCESS: 'Processing' },
        },
        Processing: {
            on: {
                SUCCESS: 'Completed',
                FAILURE: 'Failure'
            },
        },
        Completed: {
            on: { RESET: 'inactive' },
        },
        Failure: {
            on: { RESET: 'inactive' },
        },
    },
})

export { uploadStatusMachine }