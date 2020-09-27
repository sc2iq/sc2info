import { extractSc2InfoKeywords, getAnswerFromFeature, getExtractionData } from './utilities'

export default async function (phrase: string) {
    const extraction = extractSc2InfoKeywords(phrase)
    if (extraction.preparedExtraction === undefined) {
        return
    }

    const featureData = await getExtractionData(extraction.preparedExtraction)
    // The data object is the GraphQL response, which always has a data field. We want the that object.
    const data = (featureData as any).data

    const { term, type, feature } = extraction.preparedExtraction
    const answer = getAnswerFromFeature(term, type, feature, data)

    return {
        message: extraction.message,
        extraction: extraction.preparedExtraction,
        // data: extraction.data,
        answer: answer?.trim(),
    }
}
