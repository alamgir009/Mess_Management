import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Async thunks
export const fetchAllMeals = createAsyncThunk(
  "meals/fetchAllMeals",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/meal");
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchMealById = createAsyncThunk(
  "meals/fetchMealById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/meal/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addMeal = createAsyncThunk(
  "meals/addMeal",
  async (mealData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/meal/addmeal", mealData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// ✅ CORRECTED: Update Meal By Id
export const updateMealById = createAsyncThunk(
  "meals/updateMealById",
  async ({ id, mealData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/meal/${id}`, mealData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const deleteMealById = createAsyncThunk(
  "meals/deleteMealById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/meal/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addMealByAdmin = createAsyncThunk(
  "meals/addMealByAdmin",
  async ({ id, mealData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/meal/addmealbyadmin/${id}`,
        mealData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateMealByAdmin = createAsyncThunk(
  "meals/updateMealByAdmin",
  async ({ id, mealData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/meal/updatebyadmin/${id}`,
        mealData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deleteMealByAdmin = createAsyncThunk(
  "meals/deleteMealByAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/meal/deletebyadmin/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const fetchTotalMeals = createAsyncThunk(
  "meals/fetchTotalMeals",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/meal/totalMeal");
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// ✅ CORRECTED: Meal slice with proper update handling
const mealSlice = createSlice({
  name: "meals",
  initialState: {
    meals: [],
    totalMeal: 0,
    meal: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Add a reducer to clear errors
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all meals
      .addCase(fetchAllMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchAllMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch meal by ID
      .addCase(fetchMealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.loading = false;
        state.meal = action.payload;
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add meal
      .addCase(addMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.meals.push(action.payload);
      })
      .addCase(addMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ ADDED: Update meal by ID
      .addCase(updateMealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMealById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMeal = action.payload;
        const index = state.meals.findIndex(meal => meal._id === updatedMeal._id);
        
        if (index !== -1) {
          state.meals[index] = updatedMeal;
        }
        
        // Also update the single meal if it's the one being viewed
        if (state.meal && state.meal._id === updatedMeal._id) {
          state.meal = updatedMeal;
        }
      })
      .addCase(updateMealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete meal by ID
      .addCase(deleteMealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMealById.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = state.meals.filter(meal => meal._id !== action.payload._id);
        
        // Clear the single meal if it's the one being deleted
        if (state.meal && state.meal._id === action.payload._id) {
          state.meal = null;
        }
      })
      .addCase(deleteMealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add meal by admin
      .addCase(addMealByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMealByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.meals.push(action.payload);
      })
      .addCase(addMealByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update meal by admin
      .addCase(updateMealByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMealByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMeal = action.payload;
        const index = state.meals.findIndex(meal => meal._id === updatedMeal._id);
        
        if (index !== -1) {
          state.meals[index] = updatedMeal;
        }
      })
      .addCase(updateMealByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete meal by admin
      .addCase(deleteMealByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMealByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = state.meals.filter(meal => meal._id !== action.payload._id);
      })
      .addCase(deleteMealByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch total meals
      .addCase(fetchTotalMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.totalMeal = action.payload;
      })
      .addCase(fetchTotalMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = mealSlice.actions;
export default mealSlice.reducer;