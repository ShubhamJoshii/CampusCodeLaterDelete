import React, { useEffect } from "react";
import "./Progress.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissions } from "../../redux/reducer/progressSlice";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import CategoryBreakdown from "../../components/CategoryBreakdown/CategoryBreakdown";
import "./Progress.css"
import Loading from "../Loading";
import { RestrictUser } from "../../CheckAuth";

const Progress = () => {
  const dispatch = useDispatch();

  const {
    categoryBreakdown,
    difficultyStats,
    totalSolved,
    streak,
    totalQuestion,
    heatmapData,
    status
  } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchSubmissions());
  }, [dispatch]);

  if (status == "loading") {
    return <Loading style="flex-1 !h-[100%] bg-white" />
  }

  return (
    <div className="mainContent hide-scrollbar relative">
      <RestrictUser text="You must be logged in to view this page and track your progress." style="flex-1 !h-[100%] bg-white" >
        <div className="progress-container ">
          {/* 1. METRICS */}
          <div className="metrics-grid">
            {[
              { label: "Total Submissions", value: totalSolved, icon: "📊" },
              { label: "Current Streak", value: `${streak}`, icon: "🔥" },
              {
                label: "Total Completion",
                value: `${Number(
                  ((totalSolved / totalQuestion) * 100).toFixed(2)
                )}%`,
                icon: "🎯",
              },
            ].map((item, i) => (
              <div key={i} className="card metric-card">
                <div>
                  <div className="metric-label">{item.label}</div>
                  <div className="metric-value">{item.value}</div>
                </div>
                <span className="metric-icon">{item.icon}</span>
              </div>
            ))}
          </div>

          {/* 2. TOP GRID */}
          <div className="top-grid">
            {/* Progress Card */}
            <div className="card progress-card">
              <div className="progress-circle">
                <span className="progress-number">{totalSolved}</span>
                <span className="progress-label">Solved</span>
                <svg className="progress-svg">
                  <circle cx="75" cy="75" r="68" className="progress-bg" />
                  <circle
                    cx="75"
                    cy="75"
                    r="68"
                    className="progress-bar"
                    strokeDasharray="427"
                    strokeDashoffset={
                      427 - 427 * Math.min(totalSolved / 50, 1)
                    }
                  />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                {difficultyStats?.map((item) => (
                  <div key={item.label} className="difficulty-item">
                    <div className="difficulty-header">
                      <span className="difficulty-label">{item.label}</span>
                      <span className="difficulty-value">
                        {item.solved}
                        <span className="difficulty-total">
                          /{item.total}
                        </span>
                      </span>
                    </div>

                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(item.solved / item.total) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CategoryBreakdown data={categoryBreakdown} />
          </div>

          {/* 3. HEATMAP */}
          <div className="card m-auto">
            <div className="calendar-header">
              <h3 className="calendar-title">Activity Calendar</h3>
            </div>

            <div className="calendarContainer hide-scrollbar">
              <div className="calendar-wrapper w-240!">
                <CalendarHeatmap
                  startDate={new Date("2026-01-01")}
                  endDate={new Date("2026-12-31")}
                  values={Array.isArray(heatmapData) ? heatmapData : []}
                  classForValue={(value) => {
                    if (!value || value.count === 0) return "color-empty";
                    return `color-scale-${Math.min(value.count, 4)}`;
                  }}
                  titleForValue={(value) => {
                    if (!value) return "No activity";
                    return `${value.date}: ${value.count} submissions`;
                  }}
                  showWeekdayLabels={true}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="legend-row">
              <div className="legend-text">
                {totalSolved} submissions in {new Date().getFullYear()}
              </div>
              <div className="legend-scale">
                <span>Less</span>
                <div className="legend-colors">
                  {["#f1f5f9", "#bbf7d0", "#4ade80", "#16a34a", "#14532d"].map(
                    (c) => (
                      <div
                        key={c}
                        className="legend-box"
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
                <span>More</span>
              </div>
            </div>

          </div>
        </div>

      </RestrictUser>
    </div>
  );
};

export default Progress;