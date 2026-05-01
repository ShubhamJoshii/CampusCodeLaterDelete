import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProblemDetails = createAsyncThunk(
    "problemEditor/problemDetails",
    async (args = {}, thunkAPI) => {
        try {
            const response = await axios.get(`/api/problemDetails/${args}`);
            // console.log(response.data);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const runCode = createAsyncThunk(
  "problemEditor/runCode",
  async (args = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState().problemEditorDetails;

      const lang = state.currentLanguage;
      const curr = state.code?.[lang];
        // console.log(lang, curr);
      if (!curr) {
        return thunkAPI.rejectWithValue("Invalid language or code not found");
      }

      const response = await axios.post(`/api/runcode`, {
        code: curr.text || "",
        language: curr.language || "java",
        input: curr.input || "",
        _id:args
      });

      return response.data.results;

    } catch (error) {
        console.log(error)
    //   console.log(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const submitCodeSolution = createAsyncThunk(
  "problemEditor/submitCodeSolution",
  async (args = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState().problemEditorDetails;

      const lang = state.currentLanguage;
      const curr = state.code?.[lang];

      if (!curr) {
        return thunkAPI.rejectWithValue("Invalid language or code not found");
      }

      const response = await axios.post(`/api/submitSolution`, {
        code: curr.text || "",
        language: curr.language || "java",
        input: curr.input || "",
        _id:args._id,
        groupId:args.groupId || null,
      });

      return response.data;

    } catch (error) {
      console.log(error.response?.data || error.message);

      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

const problemEditorSlice = createSlice({
    name: "problemEditor",
    initialState: {
        problemDetails: {},
        code: {
            "java": {
                input: "",
                language: "java",
                output: "",
                text: ""
            },
            "cpp": {
                input: "",
                language: "cpp",
                output: "",
                text: ""
            }
        },
        output:"",
        currentLanguage: "java",
        status: "idle",
        error: null,
        result:[],
        isSubmitted:false
    },
    reducers: {
        updateCode(state, action) {
            const lang = state.currentLanguage;

            if (state.code[lang]) {
                state.code[lang] = {
                    ...state.code[lang],
                    text: action.payload
                };
            }
        },
        updateCustomInput(state, action) {
            state.code.input = action.payload;
        },
        updateSelectLanguage(state, action) {
            state.currentLanguage = action.payload;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.status = "loading";
        };
        const handleRejected = (state, action) => {
            state.status = "failed";
            state.error = action.payload?.msg || "Failed to fetch problems";
        };

        builder
            .addCase(fetchProblemDetails.pending, handlePending)
            .addCase(fetchProblemDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.problemDetails = action.payload;
                state.result = action.payload.results;
                // console.log(action.payload.results);

                const serverResponse = action.payload.defaultCode || {};

                const formatted = Object.fromEntries(
                    Object.entries(serverResponse).map(([serverKey, code]) => {

                        const normalizeLang = (key) => {
                            const map = {
                                c: "cpp",
                                cpp: "cpp",
                                java: "java",
                                js: "javascript",
                                javascript: "javascript",
                                py: "python",
                                python: "python"
                            };
                            return map[key] || key;
                        };

                        const lang = normalizeLang(serverKey);

                        return [
                            lang,
                            {
                                input: "",
                                language: lang,
                                output: "",
                                text: code || ""
                            }
                        ];
                    })
                );

                state.code = formatted;

                state.error = null;
            })
            .addCase(fetchProblemDetails.rejected, handleRejected)
            .addCase(runCode.pending, (state) => {
                state.status = "loadingRun";
            })
            .addCase(runCode.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log(action.payload);
                state.result = action.payload || action.payload.error;
                state.error = null;
            })
            .addCase(runCode.rejected, (state,action)=>{
                console.log(action.payload)
                state.result = action.payload || action.payload.error;
                state.status = "failed";
            })
            .addCase(submitCodeSolution.pending, (state) => {
                state.status = "loadingRun";
            })
            .addCase(submitCodeSolution.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log(action.payload);
                state.result = action.payload.results || action.payload.error;
                state.isSubmitted = action.payload.isSubmitted;
                state.error = null;
            })
            .addCase(submitCodeSolution.rejected, (state,action)=>{
                console.log(action.payload)
                state.result = action.payload || action.payload.error;
                state.status = "failed";
            });
    }
});

export default problemEditorSlice.reducer;
export const { updateCode, updateCustomInput, updateSelectLanguage } = problemEditorSlice.actions;