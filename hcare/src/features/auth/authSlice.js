// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { storeToken, removeStoredToken, getStoredToken, verifyToken } from "../../utils/tokenHelper";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Initialize state from stored token if available
const initializeAuthState = () => {
  const storedToken = getStoredToken();
  if (storedToken) {
    const decoded = verifyToken(storedToken);
    if (decoded) {
      return {
        ...initialState,
        user: decoded,
        token: storedToken,
      };
    } else {
      // Token is invalid, remove it
      removeStoredToken();
    }
  }
  return initialState;
};

const authSlice = createSlice({
  name: "auth",
  initialState: initializeAuthState(),
  reducers: {
    loginStart(state, action) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Store token securely
      storeToken(action.payload.token);
    },

    loginFailure(state, action) {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = action.payload || "Login failed";
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Remove stored token
      removeStoredToken();
    },

    // New action to check token validity on app start
    checkAuthStatus(state) {
      const storedToken = getStoredToken();
      if (storedToken) {
        const decoded = verifyToken(storedToken);
        if (decoded) {
          state.user = decoded;
          state.token = storedToken;
        } else {
          // Token expired or invalid
          state.user = null;
          state.token = null;
          removeStoredToken();
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  checkAuthStatus,
} = authSlice.actions;

export default authSlice.reducer;
