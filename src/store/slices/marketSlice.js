import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// ✅ Axios instance (use consistent URL structure)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ Add Market
export const addMarket = createAsyncThunk(
  "markets/addMarket",
  async (market, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/market/addMarket", market);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add new market"
      );
    }
  }
);

// ✅ Fetch all Markets total amount
export const fetchMarketAmounts = createAsyncThunk(
  "markets/fetchMarketAmounts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/market/getMarket");
      return data; // Expecting an array of markets
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch market amounts"
      );
    }
  }
);

// ✅ Delete market item by ID
export const deleteMarketById = createAsyncThunk(
  "markets/deleteMarketById", // fixed incorrect type string
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/market/${id}`);
      return id; // return the deleted market ID for state update
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete market"
      );
    }
  }
);

// ✅ Fetch grand total amount
export const fetchGrandTotalAmount = createAsyncThunk(
  "markets/fetchGrandTotalAmount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/market/getTotalMarket");
      return data; // Expecting { totalAmount: number }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch grand total amount"
      );
    }
  }
);

// ✅ Slice
const marketsSlice = createSlice({
  name: "markets",
  initialState: {
    markets: [],
    totalMarketAmount: 0,
    grandTotalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch market list
      .addCase(fetchMarketAmounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketAmounts.fulfilled, (state, action) => {
        state.loading = false;
        state.markets = action.payload;
        state.totalMarketAmount = action.payload.reduce(
          (total, market) => total + (market.amount || 0),
          0
        );
      })
      .addCase(fetchMarketAmounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred while fetching markets";
      })

      // Add new market
      .addCase(addMarket.fulfilled, (state, action) => {
        state.markets.push(action.payload);
        state.totalMarketAmount += action.payload.amount || 0;
      })
      .addCase(addMarket.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete market
      .addCase(deleteMarketById.fulfilled, (state, action) => {
        state.markets = state.markets.filter(
          (market) => market.id !== action.payload
        );
      })
      .addCase(deleteMarketById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch grand total
      .addCase(fetchGrandTotalAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrandTotalAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.grandTotalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchGrandTotalAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch grand total amount";
      });
  },
});

export default marketsSlice.reducer;
