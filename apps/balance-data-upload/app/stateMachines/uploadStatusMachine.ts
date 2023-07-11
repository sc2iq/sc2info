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
                onDone: {
                  target: "Complete"
                },
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
                                        target: "BlobFound",
                                    },
                                },
                            },
                            Wait: {
                                after: {
                                    "1000": {
                                        target: "RequestLatestBlob",
                                        actions: [],
                                    },
                                },
                            },
                            BlobFound: {
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
            Complete: {
              type: "final"
            }
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
