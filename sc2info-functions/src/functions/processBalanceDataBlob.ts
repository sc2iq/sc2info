import { app, InvocationContext, input, output } from "@azure/functions"
import { categorizeUnits } from "@sc2/convertbalancedata"

export async function blobTriggerFn(
    blob: ReadableStream,
    context: InvocationContext,
): Promise<unknown> {
    context.log(`context: ${JSON.stringify(context, null, 2)}`)

    try {
        const { name: blobTriggerName, uri: blobTriggerUri } = context.triggerMetadata
        console.log({ blobTriggerName, blobTriggerUri })

        const balanceDataJsonString = (blob as any).toString()
        const balanceDataJson = JSON.parse(balanceDataJsonString)
        const balanceDataJsonProcessed = categorizeUnits(balanceDataJson)

        context.log(`input json: ${JSON.stringify(balanceDataJson).slice(0, 1000)}`)
        context.log(`processed json: ${JSON.stringify(balanceDataJsonProcessed).slice(0, 1000)}`)
    
        return balanceDataJsonProcessed
    }
    catch (error) {
        context.log(`Error: ${error}`)
        const outputJson = {
            'data': JSON.stringify(error, null, 2)
        }

        return outputJson
    }
}

const jsonBlobOutput = output.storageBlob({
    path: 'sc2-balancedata-json-processed/balancedata_processed_{DateTime}.json',
    connection: 'AzureWebJobsStorage',
})

app.storageBlob('processBalanceDataBlob', {
    path: 'sc2-balancedata-json/{name}',
    connection: 'AzureWebJobsStorage',
    handler: blobTriggerFn,
    return: jsonBlobOutput,
})
