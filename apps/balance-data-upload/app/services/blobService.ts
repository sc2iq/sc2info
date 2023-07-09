import { BlobServiceClient } from "@azure/storage-blob"

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!)
const xmlContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_BLOB_XML_CONTAINER_NAME!)
const jsonContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_BLOB_JSON_CONTAINER_NAME!)

export {
    xmlContainerClient,
    jsonContainerClient,
}