import { api } from "../index";
import type { Issue, IssueActivityResponse, IssueListResponse } from "./types";

export interface GetIssuesParams {
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  sort?: "newest" | "oldest" | "dueDate";
}

export const issueQueryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectIssues: builder.query<IssueListResponse, GetIssuesParams>({
      query: ({
        projectId,
        page = 1,
        limit = 10,
        search,
        status,
        priority,
        assigneeId,
        sort = "newest",
      }) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));
        params.set("sort", sort);

        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (priority) params.set("priority", priority);
        if (assigneeId) params.set("assigneeId", assigneeId);

        return `/projects/${projectId}/issues?${params.toString()}`;
      },
      providesTags: (_result, _error, { projectId }) => [
        { type: "Issues", id: projectId },
      ],
    }),

    getIssueById: builder.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      transformResponse: (response: { issue: Issue }) => response.issue,
      providesTags: (_result, _error, id) => [{ type: "Issue", id }],
    }),

    getIssueActivity: builder.query<IssueActivityResponse, string>({
      query: (id) => `/issues/${id}/activity`,
      providesTags: (_result, _error, id) => [{ type: "IssueActivity", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectIssuesQuery,
  useGetIssueByIdQuery,
  useGetIssueActivityQuery,
} = issueQueryApi;
