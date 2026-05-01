import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { fetchUser } from "./redux/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";

import Wrapper from "./Wrapper";
import Loading from "./pages/Loading";
import { Bounce, ToastContainer } from "react-toastify";

const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Signup"));
const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"));
const Groups = lazy(() => import("./pages/Groups/Groups"));
const Problems = lazy(() => import("./pages/Problems/Problems"));
const Progress = lazy(() => import("./pages/Progress/Progress"));
const Settings = lazy(() => import("./pages/Setting/Settings"));
const ProblemEditor = lazy(() => import("./pages/ProblemEditor/ProblemEditor"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));

import "./App.css";
import { RedirectIfAuthenticated, RedirectIfNotAuthenticated } from "./CheckAuth";
import GroupDashboard from "./pages/GroupDashboard/GroupDashboard";
import MemberList from "./pages/MemberList/MemberList";

// const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);
  // const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  if (status == "loadingUser") {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={
                <Wrapper>
                  <Home />
                </Wrapper>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <Wrapper>
                  <Leaderboard />
                </Wrapper>
              }
            />
            <Route
              path="/leaderboard/:_id"
              element={
                <Wrapper>
                  <Leaderboard />
                </Wrapper>
              }
            />
            <Route
              path="/progress"
              element={
                <Wrapper>
                  <Progress />
                </Wrapper>
              }
            />

            <Route
              path="/groups"
              element={
                <Wrapper>
                  <Groups />
                </Wrapper>
              }
            />
            <Route
              path="/groups/:_id"
              element={
                <Wrapper>
                  <GroupDashboard />
                </Wrapper>
              }
            />
            <Route
              path="/groups/:_id/:section"
              element={
                <Wrapper>
                  <GroupDashboard />
                </Wrapper>
              }
            />
            <Route
              path="/problems"
              element={
                <Wrapper>
                  <Problems />
                </Wrapper>
              }
            />
            <Route
              path="/problems/:_id"
              element={
                <Wrapper>
                  <ProblemEditor />
                </Wrapper>
              }
            />
            <Route
              path="/problems/:_id/:groupId"
              element={
                <Wrapper>
                  <ProblemEditor />
                </Wrapper>
              }
            />
            <Route
              path="/setting"
              element={
                <RedirectIfNotAuthenticated>
                  <Wrapper>
                    <Settings />
                  </Wrapper>
                </RedirectIfNotAuthenticated>
              }
            />
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/forgotPassword"
              element={
                <RedirectIfAuthenticated>
                  <ForgetPassword />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectIfAuthenticated>
                  <Register />
                </RedirectIfAuthenticated>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="/problemeditor" element={<Wrapper>
                <ProblemEditor />
              </Wrapper>} /> */}
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
