// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from "msw";
import createGameSuccess from "./responses/createGameSuccess.json";
import variantsSuccess from "./responses/variantsSuccess.json";
import { serviceURL } from "../store/service";

const variantsUrl = `${serviceURL}Variants`;
const createGameUrl = `${serviceURL}Game`;

const internalServerError = (req, res, ctx) => {
  return res(ctx.status(500), ctx.delay(mockServiceLatency));
};

// Edit this to increase or decrease latency
const mockServiceLatency = 2000;

const resolvers = {
  createGame: {
    success: (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.delay(mockServiceLatency),
        ctx.json(createGameSuccess)
      );
    },
  },
  variants: {
    success: (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.delay(mockServiceLatency),
        ctx.json(variantsSuccess)
      );
    },
  },
};

export const handlers = {
  createGame: {
    success: rest.post(createGameUrl, resolvers.createGame.success),
    internalServerError: rest.post(createGameUrl, internalServerError),
  },
  variants: {
    success: rest.get(variantsUrl, resolvers.variants.success),
    internalServerError: rest.get(variantsUrl, internalServerError),
  },
};

export const handlersList = [

  // Comment out these two lines to cause service to return error
  handlers.createGame.success,
  handlers.variants.success,

  handlers.createGame.internalServerError,
  handlers.variants.internalServerError,
];
