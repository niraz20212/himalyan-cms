import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchHome } from '../../api/queries';

export const loadHomeThunk = createAsyncThunk('site/loadHome', fetchHome);

const siteSlice = createSlice({
  name: 'site',
  initialState: {
    home: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHomeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadHomeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.home = action.payload;
      })
      .addCase(loadHomeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default siteSlice.reducer;
