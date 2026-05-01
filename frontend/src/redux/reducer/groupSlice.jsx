import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchGroups = createAsyncThunk(
    "groups/fetchGroups",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/groups`);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchGroupDetails = createAsyncThunk(
    "groups/fetchGroupDetails",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/groupdetails/${args}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchGroupProblems = createAsyncThunk(
    "groups/fetchGroupProblems",
    async (args = {}, thunkAPI) => {
        try {
            const state = thunkAPI.getState().groups;

            const response = await axios.get(`/api/groupdetails/${args}/problems`, {
                params: {
                    pageNo: state.pageQuestion || 1,
                    limit: state.limitQuestion || 10,
                    tag: state.tag || "all"
                }
            });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchAllProblems = createAsyncThunk(
    "groups/fetchAllProblems",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/groupdetails/${args}/allproblems`);
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchGroupMembers = createAsyncThunk(
    "groups/fetchGroupMembers",
    async (args = {}, thunkAPI) => {
        try {
            const state = thunkAPI.getState().groups;

            const response = await axios.get(`/api/groupdetails/${args}/members`, {
                params: {
                    pageNo: state.pageMembers || 1,
                    limit: state.limitMembers || 10
                }
            });
            // console.log(response.data)
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const createNewGroup = createAsyncThunk(
    "groups/createGroup",
    async (args = {}, thunkAPI) => {
        const state = thunkAPI.getState().groups;
        try {
            const response = await axios.post(`/api/creategroup`, {
                name: state.groupName
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const joinNewGroup = createAsyncThunk(
    "groups/joingroup",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.post(`/api/joingroup`, {
                invitationCode: args
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const addProblem = createAsyncThunk(
    "groups/addProblem",
    async (args = {}, thunkAPI) => {
        console.log(args)
        try {
            const response = await axios.post(`/api/groupdetails/addproblem`, {
                _id: args._id,
                problemId: args.problemId,
                date: args.date
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);



const groupSlice = createSlice({
    name: "groups",
    initialState: {
        groups: [],
        groupDetails: [],
        status: "idle",
        error: null,
        groupName: "",
        problems: [],
        invitationCode: "",
        categories: [],
        tag: "all",
        isAdmin: false,

        limitQuestion: 10,
        pageQuestion: 0,
        totalQuestion: 0,
        totalPagesQuestion: 0,

        membersDetails: [],
        pageMembers: 1,
        limitMembers: 10,
        totalPagesMembers: 0,
        totalMembers: 0,

        allProblems: [],
        problemsTag: "all"


    },
    reducers: {
        createGroupName(state, action) {
            state.groupName = action.payload;
        },
        changePageQuestion(state, action) {
            state.pageQuestion = action.payload;
        },
        changeLimitQuestion(state, action) {
            state.pageNo = 1;
            state.limitQuestion = action.payload;
        },
        changeDifficultyQuestion(state, action) {
            state.difficulty = action.payload;
        },
        changeTagQuestion(state, action) {
            state.pageNo = 1;
            state.tag = action.payload;
        },
        changePageMembers(state, action) {
            state.pageMembers = action.payload;
        },
        changeLimitMembers(state, action) {
            state.pageNo = 1;
            state.limitMembers = action.payload;
        },
        changeProblemTag(state, action) {
            state.problemsTag = action.payload;
        },
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
            .addCase(fetchGroups.pending, handlePending)
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.groups = action.payload.data || [];
                state.error = null;
            })
            .addCase(fetchGroups.rejected, handleRejected)
            .addCase(createNewGroup.pending, handlePending)
            .addCase(createNewGroup.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.invitationCode = action.payload.invitationCode;
                state.error = null;
            })
            .addCase(createNewGroup.rejected, handleRejected)
            .addCase(fetchGroupDetails.pending, (state) => {
                state.status = "loadingWhole";
            })
            .addCase(fetchGroupDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.groupDetails = action.payload.group;
                state.isAdmin = action.payload.group.isAdmin;
                state.error = null;
            })
            .addCase(fetchGroupDetails.rejected, handleRejected)
            .addCase(fetchGroupProblems.pending, handlePending)
            .addCase(fetchGroupProblems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.problems = action.payload.problems;
                state.categories = action.payload.categories;
                state.pageQuestion = action.payload.pagination.page;
                state.limitQuestion = action.payload.pagination.limit;
                state.totalPagesQuestion = action.payload.pagination.totalPages;
                state.totalQuestion = action.payload.pagination.total;
                state.error = null;
            })
            .addCase(fetchGroupProblems.rejected, handleRejected)
            .addCase(addProblem.pending, handlePending)
            .addCase(addProblem.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(addProblem.rejected, handleRejected)
            .addCase(fetchAllProblems.pending, handlePending)
            .addCase(fetchAllProblems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allProblems = action.payload.problems;
                state.error = null;
            })
            .addCase(fetchAllProblems.rejected, handleRejected)
            .addCase(fetchGroupMembers.pending, handlePending)
            .addCase(fetchGroupMembers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.membersDetails = action.payload.members;
                // state.categories = action.payload.categories;
                state.pageMembers = action.payload.pagination.page;
                state.limitMembers = action.payload.pagination.limit;
                state.totalPagesMembers = action.payload.pagination.totalPages;
                state.totalMembers = action.payload.pagination.total;
                state.error = null;
            })
            .addCase(fetchGroupMembers.rejected, handleRejected)
            .addCase(joinNewGroup.pending, handlePending)
            .addCase(joinNewGroup.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(joinNewGroup.rejected, handleRejected);
    }
});


export default groupSlice.reducer;

export const { createGroupName, changeLimitQuestion, changePageQuestion, changeDifficultyQuestion, changeTagQuestion, changePageMembers, changeLimitMembers, changeProblemTag } = groupSlice.actions;