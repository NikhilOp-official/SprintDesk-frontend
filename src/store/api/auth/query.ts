import { api } from "..";
import type { LoginResponse } from "../types";

const authQueries = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<LoginResponse["user"], void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { useGetMeQuery } = authQueries;
