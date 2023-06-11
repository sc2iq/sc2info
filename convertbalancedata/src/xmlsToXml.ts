import fs from 'fs'
import * as path from 'path'

/**
 * Converts many XML files into one large XML file for easier processing
 * @param folderPath Path to folder of XML files
 */
export async function mergeXml(folderPath: string): Promise<string> {
    const filenames = await fs.promises.readdir(folderPath)
    const xmlFilenames = filenames.filter(x => x.indexOf('.xml') !== -1)
    const unitFilePromises = xmlFilenames.map(filename => {
        const filepath = path.join(folderPath, filename)
        return fs.promises.readFile(filepath, 'utf8')
    })
    const unitsStrings = await Promise.all(unitFilePromises)
    const unitsWithoutFirstlines = unitsStrings.map(u => {
        const removedFirstLine = u
            .split('\n')
            .slice(1)
            .join('\n')
        return removedFirstLine
    })

    return `
<units>
    ${unitsWithoutFirstlines.join('\n')}
</units>`.trim()

}
