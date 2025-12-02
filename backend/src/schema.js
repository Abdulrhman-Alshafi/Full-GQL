import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    me: User
    tasks: [Task!]
  }
`;
