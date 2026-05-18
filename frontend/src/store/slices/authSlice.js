import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser, loginUser, logoutUser, requestRegisterCode, verifyRegisterCode } from '../../api/queries';
import authStorage from '../../utils/authStorage';

const createApiThunk = (type, apiFn) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      return await apiFn(payload);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Request failed');
    }
  });

export const loginThunk = createApiThunk('auth/login', loginUser);
export const requestRegisterCodeThunk = createApiThunk('auth/requestRegisterCode', requestRegisterCode);
export const verifyRegisterCodeThunk = createApiThunk('auth/verifyRegisterCode', verifyRegisterCode);
export const fetchMeThunk = createApiThunk('auth/me', fetchCurrentUser);
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
  registerEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSession(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.registerEmail = null;
      authStorage.clearSession();
    },
    clearRegisterState(state) {
      state.error = null;
      state.registerEmail = null;
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
      .addCase(requestRegisterCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRegisterCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.registerEmail = action.payload.email;
      })
      .addCase(requestRegisterCodeThunk.rejected, authRejected)
      .addCase(verifyRegisterCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegisterCodeThunk.fulfilled, (state, action) => {
        applyAuthPayload(state, action);
        state.registerEmail = null;
      })
      .addCase(verifyRegisterCodeThunk.rejected, authRejected)
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
  state.error = action.payload || action.error.message;
}

export const { clearSession, clearRegisterState } = authSlice.actions;
export default authSlice.reducer;
