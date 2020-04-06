import gql from 'graphql-tag'

export const Query = gql`
  "Root of all queries for SC2 API"
  type Query {
    _empty: String
  }
`
export const Mutation = gql`
  type Mutation {
    _empty: String
  }
`
export const Subscription = gql`
  type Subscription {
    _empty: String
  }
`

export default [
    Query,
    Mutation
]
