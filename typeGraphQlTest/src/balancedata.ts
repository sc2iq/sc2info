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

const defaultBlobUrl = 'https://sc2iq.blob.core.windows.net/balancedatajson/balancedata.json'
const balanceDataUrl = process.env.BLOB_URL || defaultBlobUrl

let balanceData: IBalanceData

const isDevelopment = process.env.NODE_ENV! === 'development'

export async function getBalanceData(): Promise<IBalanceData> {

    if (balanceData) {
        return balanceData
    }

    if (isDevelopment) {
        const file = await fs.promises.readFile('./balancedata.json', 'utf8')
        balanceData = JSON.parse(file)
    }
    else {
        const response = await fetch(balanceDataUrl)
        const json = await response.json()
        if (!response.ok) {
            throw new Error(`Error during request for balance data: ${response.status}: ${response.statusText}`)
        }

        balanceData = json
    }

    return balanceData
}

export async function updateBalanceData(): Promise<void> {
    const response = await fetch(balanceDataUrl)
    const json = await response.json()
    if (!response.ok) {
        throw new Error(`Error refreshing balance data. ${response.status}: ${response.statusText}`)
    }

    balanceData = json
}

export default getBalanceData
