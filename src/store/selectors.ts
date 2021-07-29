import { RootState } from "./store";

export const selectToken = (state: RootState): string | undefined =>
  state.auth.token;
