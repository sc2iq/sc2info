import * as _ from 'lodash'
import * as utils from './utilities'

export type RootElement = {
    elements: Element[]
}

export type Element = {
    name: string
    type: string
    attributes?: Record<string, string>
    elements?: Element[]
}

export const RaceMap: { [key: string]: string } = {
    Zerg: 'zerg',
    Prot: 'protoss',
    Terr: 'terran',
    Neut: 'neutral',
}
