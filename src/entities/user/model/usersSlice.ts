import { User } from '@/shared/types/index.ts'
import { fetchUsers } from '@/api/users.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface UsersState {
  users: User[],
  loading: boolean,
  error: string | null
}

export const loadUsers = createAsyncThunk(
  'users/load',
  async () => {
    const data = await fetchUsers();
    return data;
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null
  } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(loadUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки пользователей';
    });
  }
});

export default usersSlice.reducer;
export const selectUsers = (state: { users: UsersState }) => state.users.users;
export const selectUsersLoading = (state: { users: UsersState }) => state.users.loading;
