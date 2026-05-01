import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderBoard } from "../../redux/reducer/leaderBoardSlice";
import Loading from "../Loading";

function Leaderboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { leaderboard, status } = useSelector(state => state.leaderboard);
  const { user } = useSelector(state => state.user);

  const podiumConfigs = [
    { class: "gold", icon: "🥇" },
    { class: "silver", icon: "🥈" },
    { class: "bronze", icon: "🥉" }
  ];

  const podiumOrder = [
    leaderboard[1],
    leaderboard[0],
    leaderboard[2]
  ].filter(Boolean);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchLeaderBoard());
  }, [])

  if (status == "loading") {
    return <Loading style="flex-1 !h-[100%] bg-white" />
  }

  return (
    <div className="mainContent hide-scrollbar leaderBoard">
      <div className="flex justify-between items-center mb-6">
        <h1>World Leaderboard 🏆</h1>
      </div>

      {search === "" && podiumOrder.length >= 1 && (
        <div className="podium-container">
          {podiumOrder.map((user, i) => {
            const actualRank = leaderboard.indexOf(user);
            const config = podiumConfigs[actualRank];
            return (
              <div key={user?.userID} className={`podium-step ${config.class}`}>
                <div className="rank-icon">{config.icon}</div>
                <p className="font-bold text-gray-800 truncate w-full">{user.name}</p>
                <p className="font-mono text-sm opacity-70">{user.totalPointEarned} pts</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="user-list  mb-8">
        {leaderboard?.map((curr, index) => {
          return <div key={index} className={`user-card ${curr?.userID === user?._id ? "is-current-user" : ""}`} onClick={() => {
            curr?.userID === user?._id && navigate("/progress")
          }}>
            <div className="details">
              <span className="rank">#{index + 1}</span>
              <div className="nameProgress">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{curr.name}</span>
                  {curr.userID === user?._id && <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">YOU</span>}
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(curr.totalPointEarned, 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-black text-lg">{curr.totalPointEarned}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Points</span>
            </div>
          </div>

        })}
      </div>
    </div>
  );
}

export default Leaderboard;