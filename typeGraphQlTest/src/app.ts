import express from 'express'
import cors from 'cors'
import graphqlHttp from 'express-graphql'
import { updateBalanceData } from './balancedata'
import schema from './schema'

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

export default app