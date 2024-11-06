import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Set up Axios instance to include cookies with requests
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Fetch all Markets total amount
export const fetchMarketAmounts = createAsyncThunk(
  "markets/fetchMarketAmounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/markets/total-amount");
      return response.data; // Assuming the API returns an array of market data with `amount` property
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch market amounts"
      );
    }
  }
);

const marketsSlice = createSlice({
  name: "markets",
  initialState: {
    markets: [],
    totalMarketAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Define any synchronous actions if needed (e.g., resetting state)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketAmounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketAmounts.fulfilled, (state, action) => {
        state.loading = false;
        state.markets = action.payload;

        // Calculate the total market amount
        state.totalMarketAmount = action.payload.reduce((total, market) => {
          return total + (market.amount || 0); // Adjust according to the structure of your market data
        }, 0);
      })
      .addCase(fetchMarketAmounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export default marketsSlice.reducer;
