import convertXmlTojs, { Options } from 'xml-js'

const xmlParserOptions: Options.XML2JSON = {
    
}

export function xml2jsonAsync(xml: string) {
    return new Promise<any>((resolve, reject) => {
        try {
            const jsonString = convertXmlTojs.xml2json(xml, xmlParserOptions)
            resolve(JSON.parse(jsonString))
        }
        catch (e) {
            reject(e)
        }
    })
}
