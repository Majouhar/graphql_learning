import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobByCompany,
  getJobs,
  updateJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    job: async (_root, args) => {
      const { id } = args;
      const job = await getJob(id);
      if (!job) {
        notFoundError("No job found with id " + id);
      }
      return job;
    },
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
    company: async (_root, args) => {
      const { id } = args;
      const company = await getCompany(id);
      if (!company) {
        notFoundError("No company found with id " + id);
      }
      return company;
    },
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        unauthorizedError("Unauthorized");
      }
      const companyId = user.companyId;
      const value = await createJob({ companyId, title, description });
      return value;
    },

    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        unauthorizedError("Unauthorized");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw notFoundError("No job found ");
      }
      return job;
    },
    updateJob: (_root, { id, input }, { user }) => {
      if (!user) {
        unauthorizedError("Unauthorized");
      }
      const job = updateJob(
        { id, title: input.title, description: input.description },
        user.companyId
      );
      if (!job) {
        throw notFoundError("No job found ");
      }
      return job;
    },
  },

  Job: {
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },
  Company: {
    jobs: (company) => getJobByCompany(company.id),
  },
};
function notFoundError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
function unauthorizedError() {
  throw new GraphQLError("User Not Authorized", {
    extensions: { code: "UNAUTHORIZED" },
  });
}
