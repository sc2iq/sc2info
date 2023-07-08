import { createMachine, sendTo } from "xstate"

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
                type: "parallel",
                states: {
                    ExpirationTimer: {
                        initial: "StarTimer",
                        states: {
                            StarTimer: {
                                after: {
                                    "1000": {
                                        target:
                                            "#BlobUploadProcessMachine.Processing.ExpirationTimer.TimerExpired",
                                        actions: [],
                                    },
                                },
                            },
                            TimerExpired: {
                                type: "final",
                            }
                        }
                    },
                    PollForLatestBlob: {
                        initial: "RequestLatestBlob",
                        states: {
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
                                        target: "RequestLatestBlob",
                                        actions: [],
                                    },
                                },
                            },
                            ProcessComplete: {
                                type: "final",
                            },
                        }
                    }
                },
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
                console.log('Record Current Time')
                context.startTime = Date.now()
            },
            resetForm: ({
                context,
                event,
            }) => {
                console.log('Reset Form')
                context.formRef?.reset()
            },
            requestBlobs: ({
                context,
                event,
            }) => {
                console.log('Request Blobs')
                console.log('context', context)
                sendTo(context.uploadActor, { type: 'blobFound' })
            },
        },
        guards: {},
        delays: {},
    }
)
