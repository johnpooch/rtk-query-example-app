import { Feedback } from "../store/types";
import * as selectors from "../store/selectors";

import { useAppSelector } from "./store";

export const useToken = (): string | undefined =>
  useAppSelector(selectors.selectToken);

export const useSelectEmail = (): string | undefined =>
  useAppSelector(selectors.selectEmail);

export const useFeedback = (): Feedback[] =>
  useAppSelector(selectors.feedbackSelectors.selectAll);
