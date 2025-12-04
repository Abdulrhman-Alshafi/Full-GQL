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
    createdAt: String!
  }

  type TaskEdge {
    cursor: String!
    node: Task!
  }

  type TaskConnection {
    edges: [TaskEdge!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
  input CreateTaskInput {
    title: String!
  }
  input UpdateTaskInput {
    title: String
    completed: Boolean
  }
  type Query {
    me: User
    tasks(first: Int = 10, after: String): TaskConnection!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean
  }
`;
