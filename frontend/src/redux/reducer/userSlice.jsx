import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/api/home");
            await new Promise(resolve => setTimeout(resolve, 500));
            return response.data;
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/signup", { ...data });
            // console.log(response);
            return response.data;
        } catch (error) {
            console.log(error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/login", { ...data });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/deleteUser",
    async (_id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/user/${_id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/logout")
            return null;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

export const sendOTP = createAsyncThunk(
    "user/sendOTP",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/sendOTP`, { ...data });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "user/verifyOTP",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/verifyOTP`, { ...data });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/updatePassword`, { ...data });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const userExist = createAsyncThunk("user/userExist", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/userExist/${data.email}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        status: "idle",
        page: "",
        otpID: null,
        error: null,
    },
    reducers: {
        updateUser(state, action) { },
        resetData(state, action) {
            state.user = {};
            state.status = "idle";
            state.page = "";
            state.otpID = null;
            state.error = null;
        },
        changeForgetPasswordStage(state, action) {
            state.forgetPasswordStage = action.payload;
        },
        updatePage(state, action) {
            if (action.payload === "success") {
                state.page = "EmailVerified";
            }
            else if (action.payload === "alreadyVerified") {
                state.page = "alreadyVerified";
            }
            else if (action.payload === "forgetPassword") {
                state.page = "forgetPassword";
            }
            else if (action.payload === "forgetPasswordOTP") {
                state.page = "forgetPasswordOTP";
            }
            else if (action.payload === "forgetPasswordNew") {
                state.page = "forgetPasswordNew";
            }
            else {
                state.page = null;
            }
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.status = "loading";
        };

        const handleFulfilled = (state, action) => {
            state.user = action.payload.user;
            state.status = "succeeded";
            state.page = "";
            state.error = null;
        };

        const handleRejected = (state, action) => {
            state.status = "failed";
            state.error = action.payload?.msg;
        };

        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = "loadingUser"
            })
            .addCase(fetchUser.fulfilled, handleFulfilled)
            .addCase(fetchUser.rejected, handleRejected)
            .addCase(userExist.pending, handlePending)
            .addCase(userExist.fulfilled, handleFulfilled)
            .addCase(userExist.rejected, handleRejected)
            .addCase(logoutUser.pending, handlePending)
            .addCase(logoutUser.fulfilled, handleFulfilled)
            .addCase(logoutUser.rejected, handleRejected)
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, handleFulfilled)
            .addCase(loginUser.rejected, handleRejected)
            .addCase(registerUser.pending, handlePending)
            .addCase(registerUser.fulfilled, (state, action) => {
                handleFulfilled(state, action);
                state.page = "SendedVerificationMail";
            })
            .addCase(registerUser.rejected, handleRejected)
            .addCase(deleteUser.rejected, handleRejected)
            .addCase(deleteUser.pending, handlePending)
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.page = "";
                action.payload.success && (state.page = "");
            })
            .addCase(sendOTP.rejected, handleRejected)
            .addCase(sendOTP.pending, handlePending)
            .addCase(sendOTP.fulfilled, (state, action) => {
                handleFulfilled(state, action);
                state.otpID = action.payload.user.otpID;
            })
            .addCase(verifyOTP.pending, handlePending)
            .addCase(verifyOTP.fulfilled, handleFulfilled)
            .addCase(verifyOTP.rejected, handleRejected)
            .addCase(updatePassword.pending, handlePending)
            .addCase(updatePassword.fulfilled, handleFulfilled)
            .addCase(updatePassword.rejected, handleRejected)
    }
})

export default userSlice.reducer;
export const { updateUser, updatePage, resetData, changeForgetPasswordStage } =
    userSlice.actions;
