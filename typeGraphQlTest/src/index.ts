import "reflect-metadata"
import dotenv from 'dotenv'
import app from './app'

process.on('unhandledRejection', error => {
  throw error
})

async function main() {
  dotenv.config()

  const port = process.env.PORT ?? 4000
  app.listen(port, () => {
    console.log(`sc2info api started on port: http://localhost:${port}/graphql`)
  })
}

main()