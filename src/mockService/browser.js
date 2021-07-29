import { setupWorker } from 'msw';

import { handlersList } from './handlers';

export default setupWorker(...handlersList);