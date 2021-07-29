import { combineReducers } from "redux";

import auth from "./auth";
import { diplomacyService } from "./service";

export default combineReducers({
	[diplomacyService.reducerPath]: diplomacyService.reducer,
	auth,
});
