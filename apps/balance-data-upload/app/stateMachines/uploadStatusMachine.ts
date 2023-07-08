import { createMachine } from "xstate"

export const uploadStatusMachine = createMachine(
    {
        id: "BlobUploadProcessMachine",
        context: {},
        description: "",
        initial: "Inactive",
        states: {
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
                    type: "recordCurrentTime",
                },
                initial: "StartTimer",
                states: {
                    StartTimer: {
                        after: {
                            "1000": {
                                target:
                                    "#BlobUploadProcessMachine.Processing.ProcessFailure",
                                actions: [],
                            },
                        },
                    },
                    ProcessFailure: {
                        type: "final",
                    },
                    RequestLatestBlob:
                    {
                        entry: {
                            params: {},
                            type: "requestBlobs",
                        },
                        on: {
                            blobNotFound: {
                                target: "Wait",
                            },
                            blobFound: {
                                target: "ProcessComplete",
                            },
                        },
                    },
                    Wait: {
                        after: {
                            "500": {
                                target: "#BlobUploadProcessMachine.Processing.RequestLatestBlob",
                                actions: [],
                            },
                        },
                    },
                    ProcessComplete: {
                        type: "final",
                    },
                },
                type: "parallel",
            },
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
        actions: {
            recordCurrentTime: ({
                context,
                event,
            }) => {
                context.startTime = Date.now()
            },
            resetForm: ({
                context,
                event,
            }) => {
                context.formRef?.reset()
            },
            createMachine: ({
                context,
                event,
            }) => {
                console.log('Request Blobs')
            },
        },
        guards: {},
        delays: {},
    }
)
