import { api } from "..";
import type {
  CreateProjectRequest,
  Project,
  ProjectMemberRequest,
  ProjectMembersRequest,
  UpdateProjectRequest,
} from "../types";

const projectsMutations = api.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<
      { message: string; project: Project },
      CreateProjectRequest
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<
      { message: string; project: Project },
      UpdateProjectRequest
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    addProjectMembers: builder.mutation<
      { message: string; project: Project },
      ProjectMembersRequest
    >({
      query: ({ projectId, memberIds }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { memberIds },
      }),
      invalidatesTags: ["Projects"],
    }),

    removeProjectMember: builder.mutation<
      { message: string },
      ProjectMemberRequest
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useAddProjectMembersMutation,
  useRemoveProjectMemberMutation,
} = projectsMutations;
