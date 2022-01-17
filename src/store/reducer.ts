import { combineReducers } from "redux";

import auth from "./auth";
import feedback from "./feedback";
import { authService } from "./service";

export default combineReducers({
  [authService.reducerPath]: authService.reducer,
  auth,
  feedback,
});
