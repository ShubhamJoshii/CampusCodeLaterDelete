import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLeaderBoard = createAsyncThunk(
    "leaderboard/fetchLeaderboard",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/leaderboard`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const leaderBoardSlice = createSlice({
    name: "leaderboard",
    initialState: {
        leaderboard: [],
        status: "idle",
        error: null,
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
            .addCase(fetchLeaderBoard.pending, handlePending)
            .addCase(fetchLeaderBoard.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.leaderboard = action.payload.data || 0;
                state.error = null;
            })
            .addCase(fetchLeaderBoard.rejected, handleRejected);
    }
});


export default leaderBoardSlice.reducer;