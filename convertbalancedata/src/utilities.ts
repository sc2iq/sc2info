const regex = /([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g
export function convertCamelCaseToSpacedCase(camelCaseString: string): string {
    return camelCaseString.replace(regex, '$& ')
}