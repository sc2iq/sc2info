import debug from 'debug'
import dotenv from 'dotenv'

// Dot not work because DEBUG env vars evaluated on import not at instance creation
// https://github.com/visionmedia/debug/issues/783
dotenv.config()

const baseDebug = debug('sc2info')

export const debugVerbose = baseDebug.extend('verbose')
export const debugInfo = baseDebug.extend('info')
