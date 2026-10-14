import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "./api/types";

interface AuthState {
  token: string | null;
  user: LoginResponse["user"] | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginUser, logout } = authSlice.actions;
export default authSlice.reducer;
