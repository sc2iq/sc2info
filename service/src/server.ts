import express from 'express'
import cors from 'cors'
import graphqlHttp from 'express-graphql'
import { updateBalanceData } from './balancedata'
import schema from './schema'
import dotenv from 'dotenv'

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

app.post('/refresh', async (_, res) => {
    await updateBalanceData()
    res.status(200).send('Balance Data was updated.')
})

app.get('/', (_, res) => {
    res.status(200).send(`sc2info api is running. ${new Date().toJSON()}`)
})

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`GraphQL started on port: http://localhost:${port}/graphql`)
})
