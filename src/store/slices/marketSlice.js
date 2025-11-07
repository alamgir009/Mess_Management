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

// ✅ Update Market By Id - CORRECTED
export const updateMarketById = createAsyncThunk(
  "markets/updateMarketById",
  async ({ id, marketData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/market/${id}`, marketData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update market."
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
  "markets/deleteMarketById",
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
    marketLoading: false, // Added for better state management
    error: null,
    marketError: null,
  },
  reducers: {
    // Optional: Add a reducer to clear errors
    clearError: (state) => {
      state.error = null;
      state.marketError = null;
    }
  },
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
      .addCase(addMarket.pending, (state) => {
        state.marketLoading = true;
        state.marketError = null;
      })
      .addCase(addMarket.fulfilled, (state, action) => {
        state.marketLoading = false;
        state.markets.push(action.payload);
        state.totalMarketAmount += action.payload.amount || 0;
        // Also update grand total if needed
        state.grandTotalAmount += action.payload.amount || 0;
      })
      .addCase(addMarket.rejected, (state, action) => {
        state.marketLoading = false;
        state.marketError = action.payload;
      })

      // ✅ Update market - ADDED MISSING CASES
      .addCase(updateMarketById.pending, (state) => {
        state.marketLoading = true;
        state.marketError = null;
      })
      .addCase(updateMarketById.fulfilled, (state, action) => {
        state.marketLoading = false;
        const updatedMarket = action.payload;
        const index = state.markets.findIndex(market => market._id === updatedMarket._id);
        
        if (index !== -1) {
          // Calculate the difference in amount for total updates
          const oldAmount = state.markets[index].amount || 0;
          const newAmount = updatedMarket.amount || 0;
          const amountDifference = newAmount - oldAmount;
          
          // Update the market in the array
          state.markets[index] = updatedMarket;
          
          // Update totals
          state.totalMarketAmount += amountDifference;
          state.grandTotalAmount += amountDifference;
        }
      })
      .addCase(updateMarketById.rejected, (state, action) => {
        state.marketLoading = false;
        state.marketError = action.payload;
      })

      // Delete market
      .addCase(deleteMarketById.pending, (state) => {
        state.marketLoading = true;
        state.marketError = null;
      })
      .addCase(deleteMarketById.fulfilled, (state, action) => {
        state.marketLoading = false;
        const deletedMarketId = action.payload;
        const deletedMarket = state.markets.find(market => market._id === deletedMarketId);
        
        if (deletedMarket) {
          state.markets = state.markets.filter(
            (market) => market._id !== deletedMarketId
          );
          // Update totals
          const deletedAmount = deletedMarket.amount || 0;
          state.totalMarketAmount -= deletedAmount;
          state.grandTotalAmount -= deletedAmount;
        }
      })
      .addCase(deleteMarketById.rejected, (state, action) => {
        state.marketLoading = false;
        state.marketError = action.payload;
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

export const { clearError } = marketsSlice.actions;
export default marketsSlice.reducer;