import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import * as cowsay from "cowsay"

export async function cowsayFn(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    const customSettingValue = process.env.APPSETTING_CUSTOM_KEY ?? `No Value`

    const name = request.query.get('name')
        ?? (await request.text()
            || 'world')

    const cowResponse = cowsay.say({
        text: `Hello, ${name}! CUSTOM_KEY=${customSettingValue}`,

        // cow
        // cow name
        // f: 'happy',
        // random mode
        r: true,
        
        // face
        // eyes
        // e: '^^',
        // tongue
        // T: 'uu',

        // modes

        // borg 
        // b: false,
        // dead
        // d: false,
        // greedy
        // g: false,
        // paranoia
        // p: false,
        // stoned
        // s: false,
        // tired
        // t: false,
        // wired
        // w: false,
        // youthful
        // y: false,
    })

    return { body: cowResponse }
};

app.http('cowsay', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: cowsayFn
})
