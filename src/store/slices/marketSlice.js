import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Fetch all Markets total amount
export const fetchMarketAmounts = createAsyncThunk(
  "markets/fetchMarketAmounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/market/getMarket");
      return response.data; // Assuming the API returns an array of market data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch market amounts"
      );
    }
  }
);

// NEW: Delete market item action
export const deleteMarketById = createAsyncThunk(
  "meals/deleteMealById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/market/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// Fetch grand total amount
export const fetchGrandTotalAmount = createAsyncThunk(
  "markets/fetchGrandTotalAmount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/market/getTotalMarket");
      return response.data; // Assuming the API returns { totalAmount: number }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch grand total amount"
      );
    }
  }
);

const marketsSlice = createSlice({
  name: "markets",
  initialState: {
    markets: [],
    totalMarketAmount: 0,
    grandTotalAmount: 0, // New state for grand total
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch market amounts
      .addCase(fetchMarketAmounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketAmounts.fulfilled, (state, action) => {
        state.loading = false;
        state.markets = action.payload;

        // Calculate the total market amount
        state.totalMarketAmount = action.payload.reduce((total, market) => {
          return total + (market.amount || 0);
        }, 0);
      })
      .addCase(fetchMarketAmounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Fetch grand total amount
      .addCase(fetchGrandTotalAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrandTotalAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.grandTotalAmount = action.payload.totalAmount; // Store grand total amount
      })
      .addCase(fetchGrandTotalAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch grand total amount";
      });
  },
});

export default marketsSlice.reducer;
