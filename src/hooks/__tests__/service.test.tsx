import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useCreateGameMutation, useListVariantsQuery } from "../service";
import { Provider } from "react-redux";
import { setupApiStore } from "../../store/testUtils";
import { diplomacyService } from "../../store/service";
import authReducer from "../../store/auth";
import { game, variant, newGame } from "../../store/testData";

const updateTimeout = 5000;

beforeEach((): void => {
  fetchMock.resetMocks();
});

const wrapper: React.FC = ({ children }) => {
  const storeRef = setupApiStore(diplomacyService, { auth: authReducer });
  return <Provider store={storeRef.store}>{children}</Provider>;
};

describe("useListVariantsQuery", () => {
  it("Success", async () => {
    fetchMock.mockResponse(JSON.stringify([variant]));
    const { result, waitForNextUpdate } = renderHook(
      () => useListVariantsQuery(undefined),
      { wrapper }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);
  });

  it("Internal Server Error", async () => {
    fetchMock.mockReject(new Error("Internal Server Error"));
    const { result, waitForNextUpdate } = renderHook(
      () => useListVariantsQuery(undefined),
      { wrapper }
    );
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
});

describe("useCreateGameMutation", () => {
  it("Success", async () => {
    fetchMock.mockResponse(JSON.stringify(game));
    const { result, waitForNextUpdate } = renderHook(
      () => useCreateGameMutation(undefined),
      {
        wrapper,
      }
    );
    const [createGame, initialResponse] = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(false);

    act(() => {
      void createGame(newGame);
    });

    const loadingResponse = result.current[1];
    expect(loadingResponse.data).toBeUndefined();
    expect(loadingResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const loadedResponse = result.current[1];
    expect(loadedResponse.data).not.toBeUndefined();
    expect(loadedResponse.isLoading).toBe(false);
    expect(loadedResponse.isSuccess).toBe(true);
  });

  it("Internal Server Error", async () => {
    fetchMock.mockReject(new Error("Internal Server Error"));
    const { result, waitForNextUpdate } = renderHook(
      () => useCreateGameMutation(undefined),
      {
        wrapper,
      }
    );
    const [createGame, initialResponse] = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(false);

    act(() => {
      void createGame(newGame);
    });

    const loadingResponse = result.current[1];
    expect(loadingResponse.data).toBeUndefined();
    expect(loadingResponse.isLoading).toBe(true);

    await waitForNextUpdate({ timeout: updateTimeout });

    const loadedResponse = result.current[1];
    expect(loadedResponse.data).toBeUndefined();
    expect(loadedResponse.isLoading).toBe(false);
    expect(loadedResponse.isError).toBe(true);
  });
});
