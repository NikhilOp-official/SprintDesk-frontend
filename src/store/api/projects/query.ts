import { api } from "..";
import type {
  MembersResponse,
  ProjectDetailsResponse,
  ProjectsResponse,
} from "../types";

const projectsQueries = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query<ProjectDetailsResponse, string>({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: ["Projects"],
    }),
    getAvailableMembers: builder.query<MembersResponse, void>({
      query: () => "/users/members",
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetAvailableMembersQuery,
} = projectsQueries;
