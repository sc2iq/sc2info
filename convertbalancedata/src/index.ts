#!/usr/bin/env node

import { mergeXml } from './xmlsToXml'
import { xml2jsonAsync } from './xmlToJson'
import { postProcess, Units, ICategorizedUnits } from './postProcess'
import yargs from 'yargs'
import fs from 'fs'

import * as unit from './unit'

export {
    ICategorizedUnits,
    unit
}

async function main(xmlFolder: string = './balancedata', outputFile: string = `${xmlFolder}.json`) {
    fs.existsSync(xmlFolder)

    // Raw JSON
    const xml = await mergeXml(xmlFolder)
    const units: Units = await xml2jsonAsync(xml)

    // Output Pre-Processed (.raw.json) file from xml2json.
    const unitsJson = JSON.stringify(units, null, '  ')
    const unprocessedUnitsFilename = outputFile.replace('.json', '.raw.json')
    await fs.promises.writeFile(unprocessedUnitsFilename, unitsJson, 'utf8')

    // Processed JSON
    const categorizedUnits = postProcess(units)

    // Write Processed JSON (.json)
    const categorizedUnitsJson = JSON.stringify(categorizedUnits, null, '  ')
    const finalJson = categorizedUnitsJson
    await fs.promises.writeFile(outputFile, finalJson, 'utf8')
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
