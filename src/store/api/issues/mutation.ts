import { api } from "../index";
import type { CreateIssueRequest, Issue, UpdateIssueRequest } from "./types";

export const issueMutationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createIssue: builder.mutation<
      { message: string; issue: Issue },
      CreateIssueRequest
    >({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/issues`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Issues", id: projectId },
        "Projects",
      ],
    }),

    updateIssue: builder.mutation<
      { message: string; issue: Issue },
      UpdateIssueRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Issue", id },
        "Issues",
        "IssueActivity",
        "Projects",
      ],
    }),

    deleteIssue: builder.mutation<
      { message: string },
      { id: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `/issues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: "Issue", id },
        { type: "Issues", id: projectId },
        "Projects",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueMutationApi;
