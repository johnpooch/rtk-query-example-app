import * as selectors from "../selectors";
import { initialState } from "../testData"

describe("selectToken", () => {
	test("gets token", () => {
		const testToken = "test-token";
		const auth = { isLoggedIn: true, token: testToken };
		const state = { ...initialState, auth };
		const result = selectors.selectToken(state);
		expect(result).toStrictEqual(testToken);
	});
});
