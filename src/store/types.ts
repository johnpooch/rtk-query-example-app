// POST data required when creating a new game
export type NewGame = {
  name: string;
  description: string;
  private: boolean;
  variant: string;
};

// An existing game
export type Game = NewGame & {
  finished: boolean;
  id: string;
  started: boolean;
  createdAt: string;
  startedAt: string;
  finishedAt: string;
};

export type Variant = {
  name: string;
  createdBy: string;
  description: string;
  orderTypes: string[];
};

// Request headers
export enum Headers {
  Authorization = "authorization",
  Accept = "Accept",
}
