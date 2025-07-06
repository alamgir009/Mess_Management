import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Set up Axios instance to include cookies with requests
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Fetch all users
export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/user");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// Fetch users with aggregated data
export const getAggeratedUsers = createAsyncThunk(
  "user/getAggeratedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/user/aggregatedUsers");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch aggregated users"
      );
    }
  }
);

// Fetch logged-in user's profile
export const fetchProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/user/profile");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Fetch user by ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch user with ID: ${id}`
      );
    }
  }
);

// Update user
export const userUpdate = createAsyncThunk(
  "user/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put("/user/update", updatedUser);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// Delete user by ID
export const deleteUserById = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to delete user with ID: ${id}`
      );
    }
  }
);

// Admin update user by ID
export const updateUserByAdmin = createAsyncThunk(
  "user/updateUserByAdmin",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/user/updatebyadmin/${id}`,
        updatedData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to update user with ID: ${id}`
      );
    }
  }
);

// Admin delete user by ID
export const deleteUserByAdmin = createAsyncThunk(
  "user/deleteUserByAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/user/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to delete user with ID: ${id}`
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Aggregated Users
      .addCase(getAggeratedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAggeratedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAggeratedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User by ID
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update User
      .addCase(userUpdate.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(userUpdate.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Admin Update User
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Admin Delete User
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
