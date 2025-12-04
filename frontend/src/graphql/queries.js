import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($first: Int!, $after: String) {
    tasks(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          completed
          __typename
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        __typename
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      completed
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      completed
      title
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
