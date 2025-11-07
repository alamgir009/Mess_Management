import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Set up Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Helper function to calculate total meals from meals array
const calculateTotalMeals = (meals) => {
  if (!meals || !Array.isArray(meals)) return 0;
  
  return meals.reduce((total, meal) => {
    if (meal.mealTime === 'both') {
      return total + 2;
    } else if (['breakfast', 'lunch', 'dinner', 'day', 'night'].includes(meal.mealTime)) {
      return total + 1;
    }
    return total;
  }, 0);
};

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

// Update Meal By Id
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

// Meal slice with proper state structure
const mealSlice = createSlice({
  name: "meals",
  initialState: {
    meals: [],
    totalMeal: { grandTotalMeal: 0 },
    meal: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateMealLocally: (state, action) => {
      const updatedMeal = action.payload;
      const index = state.meals.findIndex(meal => meal._id === updatedMeal._id);
      if (index !== -1) {
        // Calculate the meal count difference for total update
        const oldMeal = state.meals[index];
        const oldCount = oldMeal.mealTime === 'both' ? 2 : 1;
        const newCount = updatedMeal.mealTime === 'both' ? 2 : 1;
        const countDifference = newCount - oldCount;
        
        state.meals[index] = updatedMeal;
        
        // Update total meals count
        if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
          state.totalMeal.grandTotalMeal += countDifference;
        }
      }
    },
    removeMealLocally: (state, action) => {
      const { mealId, mealData } = action.payload;
      const mealToRemove = state.meals.find(meal => meal._id === mealId) || mealData;
      
      if (mealToRemove) {
        const mealCount = mealToRemove.mealTime === 'both' ? 2 : 1;
        state.meals = state.meals.filter(meal => meal._id !== mealId);
        
        // Update total meals count
        if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
          state.totalMeal.grandTotalMeal = Math.max(0, state.totalMeal.grandTotalMeal - mealCount);
        }
      }
    },
    addMealLocally: (state, action) => {
      const newMeal = action.payload;
      if (newMeal) {
        state.meals.push(newMeal);
        
        // Update total meals count
        const mealCount = newMeal.mealTime === 'both' ? 2 : 1;
        if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
          state.totalMeal.grandTotalMeal += mealCount;
        }
      }
    },
    updateTotalMealsLocally: (state, action) => {
      if (state.totalMeal) {
        state.totalMeal.grandTotalMeal = action.payload;
      }
    },
    // Recalculate total meals from current meals array
    recalculateTotalMeals: (state) => {
      const total = calculateTotalMeals(state.meals);
      if (state.totalMeal) {
        state.totalMeal.grandTotalMeal = total;
      }
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
        state.meals = action.payload || [];
        
        // Recalculate total meals whenever we fetch all meals
        const total = calculateTotalMeals(state.meals);
        state.totalMeal = { grandTotalMeal: total };
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
        if (action.payload) {
          state.meals.push(action.payload);
          
          // Update total meals count
          const mealCount = action.payload.mealTime === 'both' ? 2 : 1;
          if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
            state.totalMeal.grandTotalMeal += mealCount;
          }
        }
      })
      .addCase(addMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update meal by ID
      .addCase(updateMealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMealById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMeal = action.payload;
        if (updatedMeal && updatedMeal._id) {
          const index = state.meals.findIndex(meal => meal._id === updatedMeal._id);
          
          if (index !== -1) {
            // Calculate meal count difference for total update
            const oldMeal = state.meals[index];
            const oldCount = oldMeal.mealTime === 'both' ? 2 : 1;
            const newCount = updatedMeal.mealTime === 'both' ? 2 : 1;
            const countDifference = newCount - oldCount;
            
            state.meals[index] = updatedMeal;
            
            // Update total meals count
            if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
              state.totalMeal.grandTotalMeal += countDifference;
            }
          }
          
          // Also update the single meal if it's the one being viewed
          if (state.meal && state.meal._id === updatedMeal._id) {
            state.meal = updatedMeal;
          }
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
        const deletedMeal = action.payload;
        if (deletedMeal && deletedMeal._id) {
          const mealToDelete = state.meals.find(meal => meal._id === deletedMeal._id);
          
          if (mealToDelete) {
            const mealCount = mealToDelete.mealTime === 'both' ? 2 : 1;
            state.meals = state.meals.filter(meal => meal._id !== deletedMeal._id);
            
            // Update total meals count
            if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
              state.totalMeal.grandTotalMeal = Math.max(0, state.totalMeal.grandTotalMeal - mealCount);
            }
          }
          
          // Clear the single meal if it's the one being deleted
          if (state.meal && state.meal._id === deletedMeal._id) {
            state.meal = null;
          }
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
        if (action.payload) {
          state.meals.push(action.payload);
          
          // Update total meals count
          const mealCount = action.payload.mealTime === 'both' ? 2 : 1;
          if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
            state.totalMeal.grandTotalMeal += mealCount;
          }
        }
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
        if (updatedMeal && updatedMeal._id) {
          const index = state.meals.findIndex(meal => meal._id === updatedMeal._id);
          
          if (index !== -1) {
            // Calculate meal count difference for total update
            const oldMeal = state.meals[index];
            const oldCount = oldMeal.mealTime === 'both' ? 2 : 1;
            const newCount = updatedMeal.mealTime === 'both' ? 2 : 1;
            const countDifference = newCount - oldCount;
            
            state.meals[index] = updatedMeal;
            
            // Update total meals count
            if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
              state.totalMeal.grandTotalMeal += countDifference;
            }
          }
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
        const deletedMeal = action.payload;
        if (deletedMeal && deletedMeal._id) {
          const mealToDelete = state.meals.find(meal => meal._id === deletedMeal._id);
          
          if (mealToDelete) {
            const mealCount = mealToDelete.mealTime === 'both' ? 2 : 1;
            state.meals = state.meals.filter(meal => meal._id !== deletedMeal._id);
            
            // Update total meals count
            if (state.totalMeal && state.totalMeal.grandTotalMeal !== undefined) {
              state.totalMeal.grandTotalMeal = Math.max(0, state.totalMeal.grandTotalMeal - mealCount);
            }
          }
        }
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
        // Handle different possible response structures
        if (typeof action.payload === 'object' && action.payload !== null) {
          if ('grandTotalMeal' in action.payload) {
            state.totalMeal = action.payload;
          } else {
            state.totalMeal = { grandTotalMeal: action.payload };
          }
        } else if (typeof action.payload === 'number') {
          state.totalMeal = { grandTotalMeal: action.payload };
        } else {
          state.totalMeal = { grandTotalMeal: 0 };
        }
      })
      .addCase(fetchTotalMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.totalMeal = { grandTotalMeal: 0 };
      });
  },
});

export const { 
  clearError, 
  updateMealLocally, 
  removeMealLocally, 
  addMealLocally,
  updateTotalMealsLocally,
  recalculateTotalMeals
} = mealSlice.actions;

export default mealSlice.reducer;