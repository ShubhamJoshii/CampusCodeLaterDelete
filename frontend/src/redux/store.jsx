import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./reducer/userSlice";
import problemsSlice from "./reducer/problemsSlice";
import ProblemEditorSlice from "./reducer/problemEditorSlice";
import progressSlice from "./reducer/progressSlice";
import leaderboardSlice from "./reducer/leaderBoardSlice";
import groupSlice from "./reducer/groupSlice";
import settingSlice from "./reducer/settingSlice";

const store = configureStore({
    reducer:{
        user : userSlice,
        problems: problemsSlice,
        problemEditorDetails:ProblemEditorSlice,
        progress:progressSlice,
        leaderboard:leaderboardSlice,
        groups:groupSlice,
        settings:settingSlice,
    }
})

export default store;