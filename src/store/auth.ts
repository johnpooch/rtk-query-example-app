import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Auth = {
	token?: string;
	isLoggedIn: boolean;
};

const initialState: Auth = { isLoggedIn: false };

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<string>) => {
			const token = action.payload;
			localStorage.setItem("token", token);
			state.isLoggedIn = true;
			state.token = token;
		},
	},
});

export const actions = authSlice.actions;

export default authSlice.reducer;
