import { Skill } from '@/shared/types/index.ts'
import { fetchSkills } from '@/api/skills.ts'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface SkillsState {
  skills: Skill[],
  isLoading: boolean,
  error: string | null
};

const initialState: SkillsState = {
  skills: [],
  isLoading: false,
  error: null,
};

export const loadSkills = createAsyncThunk(
  'skills/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSkills();
    } catch {
      return rejectWithValue('Не удалось загрузить навыки');
    }
  }
);

export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadSkills.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadSkills.fulfilled, (state, action) => {
      state.isLoading = false;
      state.skills = action.payload;
    });
    builder.addCase(loadSkills.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка загрузки навыков';
    });
  }
});

export const selectSkills = (state: { skills: SkillsState }) => state.skills.skills;
export const selectSkillsLoading = (state: { skills: SkillsState }) => state.skills.isLoading;
export const selectSkillsError = (state: { skills: SkillsState }) => state.skills.error;

export default skillsSlice.reducer;
