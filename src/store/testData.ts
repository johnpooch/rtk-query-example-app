import { RootState } from "./store";
import { Game, NewGame, Variant } from "./types";

export const initialState: RootState = {
  auth: {
    isLoggedIn: false,
  },
  diplomacyService: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      refetchOnFocus: false,
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
      online: true,
      focused: true,
      middlewareRegistered: false,
      reducerPath: "diplomacyService",
      keepUnusedDataFor: 60,
    },
  },
};

export const newGame: NewGame = {
  name: "Game",
  description: "Description",
  private: false,
  variant: "Classical",
};

export const game: Game = {
  ...newGame,
  finished: false,
  id: "",
  started: false,
  createdAt: "",
  startedAt: "",
  finishedAt: "",
};

export const variant: Variant = {
  name: "Classical",
  createdBy: "Player",
  description: "Description",
  orderTypes: [],
};
