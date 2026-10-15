import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { logout } from "../authSlice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:7777",
  prepareHeaders: (headers, { getState }) => {
    const { auth } = getState() as RootState;

    if (auth.token) {
      headers.set("Authorization", `Bearer ${auth.token}`);
    }

    return headers;
  },
});

const baseQueryWithAuthHandling: typeof baseQuery = async (
  args,
  baseapi,
  extraOptions,
) => {
  const result = await baseQuery(args, baseapi, extraOptions);

  if (result.error) {
    const error = result.error as FetchBaseQueryError;

    if (error.status === 401) {
      const state = baseapi.getState() as RootState;
      const hadSession = Boolean(state.auth.token);

      if (hadSession) {
        baseapi.dispatch(logout());
        baseapi.dispatch(api.util.resetApiState());

        toast.error("Your session has expired. Please log in again.");
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Projects", "Issues", "Issue", "IssueActivity", "Members"],
  endpoints: () => ({}),
});
