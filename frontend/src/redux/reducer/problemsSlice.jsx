import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Updated to accept an 'args' object containing pageNo, limit, difficulty, etc.
export const fetchProblems = createAsyncThunk(
    "problems/fetchProblems",
    async (args = {}, thunkAPI) => {
        try {
            const state = thunkAPI.getState().problems;
            const response = await axios.get("/api/problems", {
                params: {
                    pageNo: state.pageNo || 1,
                    limit: state.limit || 10,
                    difficulty: state.difficulty == "all" ? "" : state.difficulty,
                    tag: state.tag
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const searchProblems = createAsyncThunk(
    "problems/searchProblems",
    async (args = {}, thunkAPI) => {
        try {
            const state = thunkAPI.getState().problems;
            const response = await axios.get("/api/searchProblems", {
                params: {
                    search: args,
                    limit: state.limit || 10,
                    pageNo: state.pageNo || 1,
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const problemsSlice = createSlice({
    name: "problems",
    initialState: {
        problemsList: [],
        pageNo: 1,
        limit: 10,
        attemptedProblemsCount:0,
        difficulty: "",
        tag: "all",
        totalProblems: 0,
        totalPages: 0,
        status: "idle",
        error: null,
        categories:["All"]
    },
    reducers: {
        changePage(state, action) {
            state.pageNo = action.payload;
        },
        changeLimit(state, action) {
            state.pageNo = 1;
            state.limit = action.payload;
        },
        changeDifficulty(state, action) {
            state.difficulty = action.payload;
        },
        changeTag(state, action) {
            state.pageNo = 1;
            state.tag = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProblems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProblems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.problemsList = action.payload.data;
                state.totalProblems = action.payload.pagination.total;
                state.categories = action.payload.categories;
                state.totalPages = action.payload.pagination.totalPages;
                state.attemptedProblemsCount = action.payload.attemptedProblemsCount;
                // console.log(action.payload);
                state.error = null;
            })
            .addCase(fetchProblems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to fetch problems";
            })
            .addCase(searchProblems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(searchProblems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.problemsList = action.payload.data;
                state.totalProblems = action.payload.pagination.total;
                state.pageNo = 1;
                state.categories = action.payload.categories;
                state.totalPages = action.payload.pagination.totalPages;
                state.error = null;
            })
            .addCase(searchProblems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to fetch problems";
            });
    }
});

export default problemsSlice.reducer;
export const {changePage, changeLimit, changeDifficulty, changeTag} = problemsSlice.actions;