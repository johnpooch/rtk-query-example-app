/* eslint-disable @typescript-eslint/unbound-method */
import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Feedback } from "./types";

const feedbackAdapter = createEntityAdapter<Feedback>();

const getNextId = (state: EntityState<Feedback>) => {
  return state.ids.length !== 0
    ? (state.ids[state.ids.length - 1] as number) + 1
    : 1;
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: feedbackAdapter.getInitialState(),
  reducers: {
    add: (state, action: PayloadAction<Omit<Feedback, "id">>) => {
      const id = getNextId(state);
      feedbackAdapter.addOne(state, { ...action.payload, id });
    },
    clear: feedbackAdapter.removeOne,
    clearAll: feedbackAdapter.removeAll,
  },
});

export const actions = feedbackSlice.actions;

export const feedbackSelectors = feedbackAdapter.getSelectors(
  (state: RootState) => state.feedback
);

export default feedbackSlice.reducer;
