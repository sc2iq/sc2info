import fetch from 'node-fetch'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

export interface IBalanceData {
    units: any[]
    upgrades: any[]
    buildings: any[]
    weapons: any[]
    abilities: any[]
    attributes: any[]
}

const balanceDataLocalFilePath = process.env.BALANCE_DATA_LOCAL_FILE_PATH
const balanceDataUrl = process.env.BLOB_URL
if (balanceDataUrl === undefined) {
    throw new Error(`Balance data url must be defined. Please check you're environment variables.`)
}

let balanceData: IBalanceData

const isDevelopment = process.env.NODE_ENV! === 'development'

export async function getBalanceData(): Promise<IBalanceData> {

    if (balanceData) {
        return balanceData
    }

    if (isDevelopment) {
        if (balanceDataLocalFilePath === undefined) {
            throw new Error(`Balance data local file path must be defined. Please check you're environment variables.`)
        }

        const file = await fs.promises.readFile(balanceDataLocalFilePath, 'utf8')
        balanceData = JSON.parse(file)
    }
    else {
        const response = await fetch(balanceDataUrl!)
        const json = await response.json()
        if (!response.ok) {
            throw new Error(`Error during request for balance data: ${response.status}: ${response.statusText}`)
        }

        balanceData = json
    }

    return balanceData
}

export async function updateBalanceData(): Promise<void> {
    const response = await fetch(balanceDataUrl!)
    const json = await response.json()
    if (!response.ok) {
        throw new Error(`Error refreshing balance data. ${response.status}: ${response.statusText}`)
    }

    balanceData = json
}

export default getBalanceData
