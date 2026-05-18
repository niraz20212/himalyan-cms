import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adminLogin } from '../../api/queries';

export const loginThunk = createAsyncThunk('auth/login', adminLogin);

const initialState = {
  user: JSON.parse(localStorage.getItem('hc_user') || 'null'),
  token: localStorage.getItem('hc_access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('hc_access_token');
      localStorage.removeItem('hc_refresh_token');
      localStorage.removeItem('hc_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem('hc_access_token', action.payload.accessToken);
        localStorage.setItem('hc_refresh_token', action.payload.refreshToken);
        localStorage.setItem('hc_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
