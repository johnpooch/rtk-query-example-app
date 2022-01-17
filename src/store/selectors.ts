import { RootState } from "./store";
export { feedbackSelectors } from "./feedback";

export const selectToken = (state: RootState): string | undefined =>
  state.auth.token;

export const selectEmail = (state: RootState): string | undefined =>
  state.auth.email;
