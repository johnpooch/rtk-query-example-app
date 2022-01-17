/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  MockedResponse,
  ResponseComposition,
  rest,
  RestContext,
  RestHandler,
  RestRequest,
} from "msw";
import { authServiceURL } from "../store/service";

import { loginResponse, registerResponse } from "./responses";

enum HandlerScenario {
  Success = "Success",
  InternalServerError = "InternalServerError",
}

enum RequestName {
  Login = "Login",
  Register = "Register",
  ChangePassword = "ChangePassword",
}

type HandlerLocalStorageKeys = {
  [key in RequestName]: string;
};

/**
 * Map RequestName to related url.
 */
const urls = {
  [RequestName.Login]: authServiceURL + "login",
  [RequestName.Register]: authServiceURL + "register",
  [RequestName.ChangePassword]: authServiceURL + "change-password",
};

/**
 * This is what comes before the RequestName when configuring resolvers using localStorage, e.g. MockHandlerCreateCart: Success
 */
const localStorageKeyPrefix = "MockHandler";

/**
 * Creates an object mapping RequestName to localStorage key, e.g. { CreateCart: MockHandlerCreateCart, ... }
 */
const getHandlerLocalStorageKeys = (): HandlerLocalStorageKeys => {
  const initialValues: Partial<HandlerLocalStorageKeys> = {};
  return Object.keys(RequestName).reduce((previousValues, key) => {
    return { ...previousValues, [key]: localStorageKeyPrefix + key };
  }, initialValues) as HandlerLocalStorageKeys;
};

const handlerLocalStorageKeys = getHandlerLocalStorageKeys();

type HandlerComposition = {
  [key in HandlerScenario]: RestHandler;
};

type MSWResponse = MockedResponse | Promise<MockedResponse<any>>;

type MSWResolver = (
  req: RestRequest<any, any>,
  res: ResponseComposition,
  ctx: RestContext
) => MockedResponse | Promise<MockedResponse<any>>;

/**
 * Default resolver for all HandlerTypes, custom resolves can be passed to composeHandlers for each HandlerType,
 * otherwise the default resolver is used.
 */
const defaultResolver = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext
): MockedResponse | Promise<MockedResponse<any>> => {
  return res(ctx.status(200));
};

/**
 * Default internal server error resolver. A custom internal server error resolver can be passed to
 * composeHandlers. If no custom resolver is passed for InternalServerError, the default resolver is used.
 */
const defaultInternalServerErrorResolver = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext
): MockedResponse | Promise<MockedResponse<any>> => {
  return res(ctx.status(500));
};

/**
 * Combines the given resolvers into an object using the specified url and method. Reduces boilerplate when creating
 * multiple handlers for the same request.
 */
const composeHandlers = (
  url: string,
  method: typeof rest.get,
  resolvers: { [key in HandlerScenario]?: MSWResolver }
): HandlerComposition => {
  const empty: Partial<HandlerComposition> = {};
  const initialValues: Partial<HandlerComposition> = Object.keys(
    HandlerScenario
  ).reduce(
    (previous, k) => ({ ...previous, [k]: method(url, defaultResolver) }),
    empty
  );
  // Use default InternalServerError resolver (can be overriden by resolvers arg).
  initialValues[HandlerScenario.InternalServerError] = method(
    url,
    defaultInternalServerErrorResolver
  );
  return Object.entries(resolvers).reduce(
    (previous, [name, resolver]) => ({
      ...previous,
      [name]: method(url, resolver as MSWResolver),
    }),
    initialValues
  ) as HandlerComposition;
};

/**
 * Custom handlers are defined here.
 */
export const handlers = {
  login: composeHandlers(urls[RequestName.Login], rest.post, {
    [HandlerScenario.Success]: (
      req: RestRequest,
      res: ResponseComposition,
      ctx: RestContext
    ): MSWResponse => {
      return res(ctx.status(200), ctx.json(loginResponse));
    },
  }),
  register: composeHandlers(urls[RequestName.Register], rest.post, {
    [HandlerScenario.Success]: (
      req: RestRequest,
      res: ResponseComposition,
      ctx: RestContext
    ): MSWResponse => {
      return res(ctx.status(200), ctx.json(registerResponse));
    },
  }),
  changePassword: composeHandlers(urls[RequestName.ChangePassword], rest.post, {
    [HandlerScenario.Success]: (
      req: RestRequest,
      res: ResponseComposition,
      ctx: RestContext
    ): MSWResponse => {
      return res(ctx.status(200), ctx.json({}));
    },
  }),
};

const getHandler = (key: string, handler: HandlerComposition) => {
  return handler[
    (localStorage.getItem(key) as HandlerScenario) || HandlerScenario.Success
  ];
};

export default [
  getHandler(handlerLocalStorageKeys[RequestName.Login], handlers.login),
  getHandler(handlerLocalStorageKeys[RequestName.Register], handlers.register),
  getHandler(
    handlerLocalStorageKeys[RequestName.ChangePassword],
    handlers.changePassword
  ),
];
