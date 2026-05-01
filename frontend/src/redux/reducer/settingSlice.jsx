import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSettingDetails = createAsyncThunk(
    "settings/fetchSettingDetails",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/fetchsettings`);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const changeUsername = createAsyncThunk(
    "settings/changeUsername",
    async (args = {}, thunkAPI) => {
        const state = thunkAPI.getState().settings;
        try {
            const response = await axios.post(`/api/changeusername`, {
                userName: state.modalData.username,
                password: state.modalData.password
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const changeEmail = createAsyncThunk(
    "settings/changeEmail",
    async (args = {}, thunkAPI) => {
        const state = thunkAPI.getState().settings;
        try {
            const response = await axios.post(`/api/changeemail`, {
                email: state.modalData.email,
                password: state.modalData.password
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const changePassword = createAsyncThunk(
    "settings/changePassword",
    async (args = {}, thunkAPI) => {
        const state = thunkAPI.getState().settings;
        try {
            const response = await axios.post(`/api/changepassword`, {
                confirmPassword: state.modalData.newconfirmpassword,
                password: state.modalData.newpassword
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "settings/deleteAccount",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/user`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

const settingSlice = createSlice({
    name: "settings",
    initialState: {
        setting: {},
        status: "idle",
        error: null,
        modal: "",
        modalData: {
            username: "",
            email: "",
            password: "",
            newpassword: "",
            newconfirmpassword: ""
        }
    },
    reducers: {
        changeModal(state, action) {
            state.modal = action.payload;
        },
        resetModalData(state, action) {
            state.modalData = {
                username: "",
                email: "",
                password: "",
                newpassword: "",
                newconfirmpassword: ""
            }
        },
        changeModalData(state, action) {
            const { target, value } = action.payload;
            if (!state.modalData) state.modalData = {};
            state.modalData[target] = value;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.status = "loading";
        };
        const handleFulfilled = (state, action) => {
            state.status = "succeeded";
                state.error = null;
        };
        const handleRejected = (state, action) => {
            state.status = "failed";
            state.error = action.payload?.msg || "Failed to fetch";
        };
        builder
            .addCase(fetchSettingDetails.pending, handlePending)
            .addCase(fetchSettingDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.setting = action.payload || {};
                state.modalData.email = action.payload.email || "";
                state.modalData.username = action.payload.userName || "";
                state.error = null;
            })
            .addCase(fetchSettingDetails.rejected, handleRejected)
            .addCase(changeEmail.pending, handlePending)
            .addCase(changeEmail.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(changeEmail.rejected, handleRejected)
            .addCase(changeUsername.pending, handlePending)
            .addCase(changeUsername.fulfilled, handleFulfilled)
            .addCase(changeUsername.rejected, handleRejected)
            .addCase(changePassword.pending, handlePending)
            .addCase(changePassword.fulfilled, handleFulfilled)
            .addCase(changePassword.rejected, handleRejected)
            .addCase(deleteAccount.pending, handlePending)
            .addCase(deleteAccount.fulfilled, handleFulfilled)
            .addCase(deleteAccount.rejected, handleRejected);
    }
});


export default settingSlice.reducer;
export const { changeModal, changeModalData, resetModalData } = settingSlice.actions