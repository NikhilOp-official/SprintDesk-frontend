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
      providesTags: (_result, _error, projectId) => [
        "Projects",
        { type: "Projects", id: projectId },
      ],
    }),
    getAvailableMembers: builder.query<MembersResponse, void>({
      query: () => "/users/members",
      providesTags: ["Members"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetAvailableMembersQuery,
} = projectsQueries;
