import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../../api/queries';
import authStorage from '../../utils/authStorage';

export const loginThunk = createAsyncThunk('auth/login', loginUser);
export const registerThunk = createAsyncThunk('auth/register', registerUser);
export const fetchMeThunk = createAsyncThunk('auth/me', fetchCurrentUser);
export const logoutThunk = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const refreshToken = authStorage.getRefreshToken();
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  return getState().auth.user;
});

const initialState = {
  user: authStorage.getUser(),
  token: authStorage.getAccessToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      authStorage.clearSession();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, applyAuthPayload)
      .addCase(loginThunk.rejected, authRejected)
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, applyAuthPayload)
      .addCase(registerThunk.rejected, authRejected)
      .addCase(fetchMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        authStorage.setUser(action.payload);
      })
      .addCase(fetchMeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        authStorage.clearSession();
      });
  },
});

function applyAuthPayload(state, action) {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.accessToken;
  authStorage.setSession({
    accessToken: action.payload.accessToken,
    refreshToken: action.payload.refreshToken,
    user: action.payload.user,
  });
}

function authRejected(state, action) {
  state.loading = false;
  state.error = action.error.message;
}

export const { clearSession } = authSlice.actions;
export default authSlice.reducer;
