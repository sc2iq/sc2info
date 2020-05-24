import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { AbilitiesResolver } from "./models/abilities"
import express from 'express'
import cors from 'cors'
import graphqlHttp from 'express-graphql'
import dotenv from 'dotenv'

process.on('unhandledRejection', error => {
  throw error
})

async function main() {
  const schema = await buildSchema({
    resolvers: [AbilitiesResolver],
    emitSchemaFile: true,
  })

  dotenv.config()

  const app = express()

  app.use(cors())

  app.use(
    '/graphql',
    graphqlHttp({
      schema,
      graphiql: true,
      pretty: true,
    })
  )

  app.get('/', (_, res) => {
    res.status(200).send(`sc2info api is running. ${new Date().toJSON()}`)
  })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`sc2info api started on port: http://localhost:${port}/graphql`)
  })
}

main()