import { setupWorker } from "msw";

import handlers from "./handlers";

export default setupWorker(...handlers);
