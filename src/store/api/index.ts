import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    toast.error("Your session has expired. Please log in again.");
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Projects", "Issues", "Issue", "IssueActivity"],
  endpoints: () => ({}),
});
