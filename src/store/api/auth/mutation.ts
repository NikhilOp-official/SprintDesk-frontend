import { api } from "..";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateMemberRequest,
  CreateMemberResponse,
  LoginRequest,
  LoginResponse,
} from "../types";

const authMutations = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createMember: builder.mutation<CreateMemberResponse, CreateMemberRequest>({
      query: (body) => ({
        url: "/users/member",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Members"],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useCreateMemberMutation,
} = authMutations;
