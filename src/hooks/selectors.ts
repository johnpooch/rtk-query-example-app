import * as selectors from "../store/selectors";

import { useAppSelector } from "./store";

export const useToken = (): string | undefined =>
  useAppSelector(selectors.selectToken);
