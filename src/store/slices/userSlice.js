import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

//Fetch all users
export const getUsers = createAsyncThunk("user/getUsers", async () => {
  const response = await axios.get(`${API_URL}/user/`);
  return response.data;
});

//Fetch user by id
export const getUserById = createAsyncThunk("user/getUserById", async (id) => {
  const response = await axios.get(`${API_URL}/user/${id}`);
  return response.data;
});

//Update user by id
export const userUpdate = createAsyncThunk(
  "user/updateUser",
  async (updatedUser) => {
    const response = await axios.put(`${API_URL}/user/update`, updatedUser);
    return response.data;
  }
);

//Delete user by id
export const deleteUserById = createAsyncThunk("user/delete", async (id) => {
  const response = await axios.delete(`${API_URL}/user/${id}`);
  return response.data;
});

// Update user by Admin
export const updateUserByAdmin = createAsyncThunk(
  "user/updateUserByAdmin",
  async ({ id, updatedData }) => {
    const response = await axios.put(
      `${API_URL}/user/updatebyadmin/${id}`,
      updatedData
    );
    return response.data;
  }
);

//Delete user by Admin
export const deleteUserByAdmin = createAsyncThunk(
  "user/deleteUserByAdmin",
  async (id) => {
    const response = await axios.delete(`${API_URL}/user/delete/${id}`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        (state.loading = true), (state.loading = null);
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        (state.loading = false), (state.users = action.payload);
      })
      .addCase(getUsers.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
