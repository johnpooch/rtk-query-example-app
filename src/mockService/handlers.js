// See: https://mswjs.io/docs/getting-started/mocks/rest-api
import { rest } from "msw";
import createGameSuccess from "./responses/createGameSuccess.json";
import variantsSuccess from "./responses/variantsSuccess.json";
import { serviceURL } from "../store/service";

const variantsUrl = `${serviceURL}Variants`;
const createGameUrl = `${serviceURL}Game`;

const internalServerError = (req, res, ctx) => {
  return res(ctx.status(500));
};
const tokenTimeout = (req, res, ctx) => {
  return res(ctx.status(401), ctx.text("token timed out"));
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
    tokenTimeout: rest.post(createGameUrl, tokenTimeout),
  },
  variants: {
    success: rest.get(variantsUrl, resolvers.variants.success),
    internalServerError: rest.get(variantsUrl, internalServerError),
    tokenTimeout: rest.get(variantsUrl, tokenTimeout),
  },
};

// Edit this to cause error responses
export const handlersList = [
  handlers.createGame.success,
  // handlers.createGame.internalServerError,
  handlers.variants.success,
  // handlers.variants.internalServerError,
];
