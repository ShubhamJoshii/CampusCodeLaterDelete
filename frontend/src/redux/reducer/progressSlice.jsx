import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Updated to accept an 'args' object containing pageNo, limit, difficulty, etc.
export const fetchSubmissions = createAsyncThunk(
    "progress/submission",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/submission`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchStreak = createAsyncThunk(
    "progress/streak",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/streak`);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const progressSlice = createSlice({
    name: "progress",
    initialState: {
        submissions: [],
        status: "idle",
        error: null,
        totalSolved:0,
        categoryBreakdown: [],
        heatmapData:[],
        streak:0,
        totalQuestion:1,
        difficultyStats: [
            {
                label: "Easy",
                solved: 0,
                total: 16,
                color: "#22c55e",
            },
            {
                label: "Medium",
                solved: 0,
                total: 12,
                color: "#eab308",
            },
            {
                label: "Hard",
                solved: 0,
                total: 10,
                color: "#ef4444",
            },
        ]
    },
    reducers: {
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.status = "loading";
        };
        const handleRejected = (state, action) => {
            state.status = "failed";
            state.error = action.payload?.msg || "Failed to fetch";
        };
        builder
            .addCase(fetchSubmissions.pending, handlePending)
            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.submissions = action.payload.data;
                state.categoryBreakdown = action.payload.categoryBreakdown;
                state.difficultyStats = action.payload.difficultyStats;
                state.totalSolved = action.payload.totalSolved;
                state.heatmapData = action.payload.heatmapData || [];
                state.streak = action.payload.streak || 0;
                state.totalQuestion = action.payload.totalQuestion || 0;
                state.error = null;
            })
            .addCase(fetchSubmissions.rejected, handleRejected)
            .addCase(fetchStreak.pending, handlePending)
            .addCase(fetchStreak.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.streak = action.payload.streak || 0;
                state.error = null;
            })
            .addCase(fetchStreak.rejected, handleRejected);
    }
});


export default progressSlice.reducer;