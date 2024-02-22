import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
  createHttpLink,
  gql,
} from "@apollo/client";

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  },
});

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});
export const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
  cache: new InMemoryCache(),
  link: concat(authLink, httpLink),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    date
    company {
      id
      name
    }
  }
`;

export const getJobByIDQuery = gql`
  query JobByID($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
export async function getJobs(limit, offset) {
  const query = gql`
    query Jobs($limit: Int, $offset: Int) {
      jobs(limit: $limit, offset: $offset) {
        items {
          ...JobDetail
        }
        totalCount
      }
    }
    ${jobDetailFragment}
  `;
  // const { jobs } = await client.request(query);
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
    variables: { limit, offset },
  });
  return data.jobs;
}

export async function getJob(id) {
  const query = getJobByIDQuery;
  // const { job } = await client.request(query, { id });
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.job;
}
export const copmpanyByIDQuery = gql`
  query CompanyByID($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;
export async function getCompanyByID(id) {
  const query = copmpanyByIDQuery;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}
export const createJobMutation = gql`
  mutation ($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
export async function createJob({ title, description }) {
  const query = createJobMutation;

  // const { job } = await client.request(query, {
  //   input: { title, description },
  // });
  const { data } = await apolloClient.mutate({
    mutation: query,
    variables: { input: { title, description } },
    update: (cache, result) => {
      cache.writeQuery({
        query: getJobByIDQuery,
        variables: { id: result.data.job.id },
        data: result.data,
      });
    },
  });
  return data.job;
}

export async function updateJob(id, title, description) {
  const query = gql`
    mutation ($id: ID!, $input: CreateJobInput!) {
      updateJob(id: $id, input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation: query,
    variables: {
      id,
      input: { title, description },
    },
  });
  return data.job;
}
export async function deleteJob(id) {
  const query = gql`
    mutation ($id: ID!) {
      deleteJob(id: $id) {
        id
      }
    }
  `;

  try {
    // const { job } = await client.request(query, {
    //   id,
    // });

    const { data } = await apolloClient.mutate({
      mutation: query,
      variables: {
        id,
      },
    });
    return data.job;
  } catch (error) {
    alert(error.message);
    return null;
  }
}
