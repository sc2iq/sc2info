import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { categorizeUnits } from "@sc2/convertbalancedata"

export async function processBalanceData(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    context.log(`Starting processing...`)
    const processedBalanceData = categorizeUnits({ elements: [] } as any)
    context.log(`Finished processing!`)

    return { body: processedBalanceData }
};

app.http('process-balance-data', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: processBalanceData
})
