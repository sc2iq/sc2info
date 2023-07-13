import { createMachine } from "xstate"

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
                    5000: {
                        target: 'ProcessComplete',
                        actions: ['timerExpired'],
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
                            500: {
                                target: "RequestLatestBlob",
                            },
                        },
                    },
                },
            },
            ProcessComplete: {
                entry: {
                    params: {},
                    type: "recordEndTime",
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
