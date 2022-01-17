import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "./service";

export type Auth = {
  token?: string;
  email?: string;
};

const initialState: Auth = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      localStorage.setItem("token", token);
      state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authService.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        return {
          token: payload.token,
          email: payload.email,
        };
      }
    );
  },
});

export const actions = authSlice.actions;

export default authSlice.reducer;
