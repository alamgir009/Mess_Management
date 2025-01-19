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
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateMealById = createAsyncThunk(
  "meals/updateMealById",
  async ({ id, mealData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/meal/${id}`, mealData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
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

// Meal slice
const mealSlice = createSlice({
  name: "meals",
  initialState: {
    meals: [],
    totalMeal: 0,
    meal: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.meal = action.payload;
      })
      .addCase(fetchTotalMeals.fulfilled, (state, action) => {
        state.totalMeal = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.startsWith("meals/"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.type.startsWith("meals/"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.startsWith("meals/"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default mealSlice.reducer;
