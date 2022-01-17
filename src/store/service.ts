import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { selectToken } from "./selectors";
import { RootState } from "./store";
import {
  ChangePasswordRequestData,
  Headers,
  LoginRequestData,
  LoginResponseData,
  RegisterRequestData,
  RegisterResponseData,
} from "./types";

export const authServiceURL = "https://fake-auth-service.com/";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: fetchBaseQuery({
    baseUrl: authServiceURL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState() as RootState);
      if (token) {
        headers.set(Headers.Authorization, `Bearer ${token}`);
      }
      headers.set(Headers.Accept, "application/json");
      return headers;
    },
    mode: "cors",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseData, LoginRequestData>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<RegisterResponseData, RegisterRequestData>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/ban-types
    changePassword: builder.mutation<{}, ChangePasswordRequestData>({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});
