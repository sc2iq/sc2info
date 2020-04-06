import gql from "graphql-tag"

const typeDefs = gql`
    extend type Query {
        "Unit attributes such as (light, armored, mechanical)"
        attributes: [String!]!
    }
`

export default typeDefs

