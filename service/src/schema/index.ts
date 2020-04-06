import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers as any
})

export default schema