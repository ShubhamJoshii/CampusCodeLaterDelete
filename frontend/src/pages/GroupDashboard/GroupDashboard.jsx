import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  changeLimitQuestion, changePageQuestion, changeTagQuestion,
  fetchGroupDetails, fetchGroupMembers, fetchGroupProblems
} from "../../redux/reducer/groupSlice";
import ProblemList from "../../components/ProblemList/ProblemList";
import "./GroupDashboard.css"; // 👈 Your new external CSS file
import Members from "./Members";
import GroupChat from "./GroupChat";
import AddQuestion from "./AddQuestion";
import Loading from "../Loading";

function GroupDashboard() {
  const { _id, section = "question" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { groups, groupDetails, isAdmin, problems, tag, status, categories, pageQuestion, limitQuestion, totalQuestion,
    totalPagesQuestion, pageMembers, limitMembers } = useSelector(state => state.groups);


  const props = {
    problemsList: problems,
    totalPages: totalPagesQuestion,
    tag,
    attemptedProblemsCount: 0,
    status,
    totalProblems: totalQuestion,
    limit: limitQuestion,
    pageNo: pageQuestion,
    categories,
    changePage:
      changePageQuestion,
    changeLimit: changeLimitQuestion,
    changeTag: changeTagQuestion,
  };

  useEffect(() => {
    dispatch(fetchGroupDetails(_id));
  }, [dispatch, _id]);

  useEffect(() => {
    dispatch(fetchGroupProblems(_id));
  }, [limitQuestion, pageQuestion, _id, tag, dispatch]);

  useEffect(() => {
    dispatch(fetchGroupMembers(_id));
  }, [section, pageMembers, limitMembers,]);


  const isQuestionActive = (location.pathname === `/groups/${_id}` ||
    location.pathname === `/groups/${_id}/question`) || !(
      location.pathname === `/groups/${_id}/addquestion` ||
      location.pathname === `/groups/${_id}/members` ||
      location.pathname === `/groups/${_id}/chat`);

  if (status == "loadingWhole") {
    return <Loading style="flex-1 !h-[100%] bg-white" />
  }

  return (
    <div className="mainContent relative  hide-scrollbar dashboard-container">
      {/* HEADER BAR */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-titles">
            <h1>{groupDetails?.name || "Group"}</h1>
            <span className="group-id-badge">ID: {groupDetails?._id}</span>
          </div>
        </div>

        <div className="header-right">
          <button
            onClick={() => navigate(`/leaderboard/${groupDetails?._id}`)}
            className="leaderboard-btn"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* ASIDE: STATS & NAV */}
        <aside className="dashboard-sidebar ">
          <div className="stats-card">
            <h3 className="section-label">Overview</h3>

            <div className="rank-display">
              <div className="rank-info">
                <span>Rank</span>
                <span className="rank-number">#{groupDetails?.yourRank || "0"}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "66%" }}></div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-unit">
                <span className="stat-label">Members</span>
                <span className="stat-value">{groupDetails?.totalMembers}</span>
              </div>
              <div className="divider-v"></div>
              <div className="stat-unit">
                <span className="stat-label">Questions</span>
                <span className="stat-value">{groupDetails?.totalQuestions}</span>
              </div>
            </div>
          </div>

          <nav className="action-nav">
            <NavLink className={`nav-item ${isQuestionActive ? "active" : ""}`} to={`/groups/${_id}/question`}><span>🤖</span> Problems</NavLink>
            {isAdmin && <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to={`/groups/${_id}/addquestion`}><span>➕</span> Add Question</NavLink>}
            <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to={`/groups/${_id}/members`}><span>👥</span> Members List</NavLink>
            <NavLink className={({ isActive }) => `nav-item chat ${isActive ? "active" : ""}`} to={`/groups/${_id}/chat`}><span>💬</span> Community Chat</NavLink>
          </nav>
        </aside>

        <section className="dashboard-content">
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">{(section != "members" && section != "addquestion" && section != "chat") && "AVAILABLE_PROBLEMS"} {section == "members" && "Group_Members"} {section == "addquestion" && "📚 Select_Question_from_Bank"} {section == "chat" && "Group_Chat"}</h2>
              <div className="window-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>

            <div className="list-wrapper">
              {(section != "members" && section != "addquestion" && section != "chat") && <ProblemList {...props} groupId={groupDetails?._id} />}
              {section == "members" && <Members {...props} />}
              {section == "addquestion" && <AddQuestion {...props} />}
              {section == "chat" && <GroupChat {...props} />}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default GroupDashboard;