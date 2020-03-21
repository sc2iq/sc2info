import * as xml2js from 'xml2js'

const xmlParserOptions: xml2js.Options = {
    explicitRoot: false,
    mergeAttrs: true,
    emptyTag: null,
    explicitArray: false,
}

export function xml2jsonAsync(xml: string) {
    return new Promise<any>((resolve, reject) => {
        xml2js.parseString(xml, xmlParserOptions, (error, json) => {
            if (error) {
                reject(error)
                return
            }

            resolve(json)
        })
    })
}
