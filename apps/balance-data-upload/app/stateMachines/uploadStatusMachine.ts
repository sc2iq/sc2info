import { createMachine } from "xstate"

export const expirationDurationMilliseconds = 15000
export const pollIntervalDelayMilliseconds = 1000

export const uploadStatusMachine = createMachine(
    {
        id: "BlobUploadProcessMachine",
        context: {},
        description: "",
        initial: "Inactive",
        states: {
            Inactive: {
                entry: {
                    params: {},
                    type: "resetForm",
                },
                on: {
                    upload: {
                        target: "Uploading",
                    },
                },
            },
            Uploading: {
                on: {
                    process: {
                        target: "Processing",
                    },
                },
            },
            Processing: {
                entry: {
                    params: {},
                    type: "recordStartTime",
                },
                initial: "RequestLatestBlob",
                after: {
                    [expirationDurationMilliseconds]: {
                        target: 'ProcessFailed',
                    },
                },
                states: {
                    RequestLatestBlob: {
                        entry: "requestBlobs",
                        on: {
                            blobNotFound: {
                                target: "Wait",
                            },
                            blobFound: {
                                target: "#BlobUploadProcessMachine.ProcessComplete",
                            },
                        },
                    },
                    Wait: {
                        after: {
                            [pollIntervalDelayMilliseconds]: {
                                target: "RequestLatestBlob",
                            },
                        },
                    },
                },
            },
            ProcessComplete: {
                entry: {
                    type: "recordEndTime",
                    params: {},
                },
                type: "final",
            },
            ProcessFailed: {
                entry: {
                    type: "timerExpired",
                    params: {},
                },
                type: "final",
            },
        },
        types: {
            events: {} as
                | {
                    type: "blobNotFound"
                }
                | {
                    type: "blobFound"
                }
                | {
                    type: "process"
                }
                | {
                    type: "upload"
                },
        },
    },
    {
        actions: {},
        guards: {},
        delays: {},
    }
)
