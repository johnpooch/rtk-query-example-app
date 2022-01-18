import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { selectToken } from "./selectors";
import { RootState } from "./store";
import { Headers, NewGame, Game, Variant } from "./types";

export const serviceURL = "https://fake-url.com/";

export const diplomacyService = createApi({
  reducerPath: "diplomacyService",
  baseQuery: fetchBaseQuery({
    baseUrl: serviceURL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState() as RootState);
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set(Headers.Authorization, `Bearer ${token}`);
      }
      headers.set(Headers.Accept, "application/json");
      return headers;
    },
    mode: "cors",
  }),
  endpoints: (builder) => ({
    listVariants: builder.query<Variant[], undefined>({
      query: () => "/Variants",
    }),
    createGame: builder.mutation<Game, NewGame>({
      query: (body) => ({
        url: "/Game",
        method: "POST",
        body,
      }),
    }),
  }),
});
