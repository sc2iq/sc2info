import debug from 'debug'

const baseDebug = debug('sc2info')

export const debugVerbose = baseDebug.extend('verbose')
export const debugInfo = baseDebug.extend('info')
