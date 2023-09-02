#!/usr/bin/env node

/// <reference lib="dom" />

import { categorizeUnits } from './postProcess'
import yargs from 'yargs'
import fs from 'fs'
import * as unit from './unit'

export {
    unit
}

async function main(
    unprocessedJsonUrl: string = 'https://sharedklgoyistorage.blob.core.windows.net/sc2-balancedata-json/balancedata_2023-07-30T19-59-44Z.json',
    outputFileName: string
) {
    const dateString = (new Date()).toISOString()
        .replace(/[^A-Za-z0-9]+/g, '')
        // .replace(/:/g, '')
        // .replace(/\./g, '')
    outputFileName ??= `balancedata_${dateString}.json`

    // Fetch Unprocessed JSON (.json)
    const unprocessedJsonResponse = await fetch(unprocessedJsonUrl)
    if (!unprocessedJsonResponse.ok) {
        throw new Error(`Failed to fetch unprocessed JSON from ${unprocessedJsonUrl}`)
    }

    const rawXmlAsJson = await unprocessedJsonResponse.json() as unit.RootElement

    // Process JSON
    const categorizedUnits = categorizeUnits(rawXmlAsJson as any)
    console.log({ categorizedUnits, outputFileName })

    // Write Processed JSON (.json)
    const categorizedUnitsJson = JSON.stringify(categorizedUnits, null, '  ')
    await fs.promises.writeFile(outputFileName, categorizedUnitsJson, 'utf8')
}

const argv = yargs
    .usage('Usage: $0 <command> <input> <output>')
    .example(
        '$0 ./balancedata ./balancedata.json',
        'Parse XML files from ./balancedata folder, output as ./balancedata.json'
    )
    .help('h')
    .alias('h', 'help').argv

const xmlFolder = argv._[0]
const outputFile = argv._[1]

main(xmlFolder, outputFile)
