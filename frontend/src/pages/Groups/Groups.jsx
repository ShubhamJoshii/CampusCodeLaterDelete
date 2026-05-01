import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreateGroup from '../../components/CreateGroup.jsx/CreateGroup';
import { createGroupName, fetchGroups, joinNewGroup } from '../../redux/reducer/groupSlice';
import "./Groups.css";
import { toast } from 'react-toastify';
import Loading from '../Loading';
import { RestrictUser } from '../../CheckAuth';

const Groups = () => {
  const [createGroupShow, setCreateGroupShow] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groups, groupName, status } = useSelector(state => state.groups);

  const stats = [
    { head: "Total groups", text: groups.length },
    { head: "🔥 Streak", text: "5" },
    { head: "Status", text: "active" },
  ];

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const createGroup = () => {
    setCreateGroupShow(true);
  };

  const joinGroup = async () => {
    try {
      const response = await dispatch(joinNewGroup(code)).unwrap();
      dispatch(fetchGroups());
      toast.success(response?.msg || "Joined successful");
    } catch (error) {
      toast.error(error?.msg || "User already in group");

    }
  };

  if (status == "loading") {
    return <Loading style="flex-1 !h-[100%] bg-white" />
  }

  return (
    <div className='groups-container mainContent hide-scrollbar'>
      <RestrictUser text="You must be logged in to view this page and access groups." style="flex-1 !h-[100%] relative bg-white" >
        <CreateGroup
          createGroupShow={createGroupShow}
          setCreateGroupShow={setCreateGroupShow}
        />

        <div className="metrics">
          {[
            { label: "Total Groups", value: 4, icon: "📊" },
            { label: "Current Streak", value: 5, icon: "🔥" },
            {label: "Total Submissions",value: 5,icon: "🎯",}
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

        {/* Actions Section */}
        <div className="actions-grid">
          <div className="cardBorder action-card">
            <h2 className="action-title">
              <span className="icon-box green">➕</span>
              Create Group
            </h2>
            <input
              value={groupName}
              onChange={(e) => dispatch(createGroupName(e.target.value))}
              placeholder="e.g. Design Team"
              className="group-input"
            />
            <button onClick={createGroup} className="btn-primary">
              Create New Group
            </button>
          </div>

          <div className="cardBorder action-card">
            <h2 className="action-title">
              <span className="icon-box blue">🔗</span>
              Join Group
            </h2>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter invitation code"
              className="group-input uppercase"
            />
            <button onClick={joinGroup} className="btn-secondary">
              Join with Code
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="groups-list-wrapper">
          <h2 className="list-title">
            Your Groups <span className="count">({groups.length})</span>
          </h2>

          {groups.length === 0 ? (
            <div className="empty-state">
              <p>No groups joined yet. Start by creating one! ❌</p>
            </div>
          ) : (
            <div className="groups-grid">
              {groups?.map((g) => {
                return <div
                  key={g._id}
                  onClick={() => navigate(`/groups/${g._id}`)}
                  className="group-item-card"
                >
                  <div className='flex justify-between items-center'>
                    <h3>{g.name}</h3>
                    {g.isAdmin && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="group-code">CODE: {g.invitationCode}</span>
                </div>
              })}
            </div>
          )}
        </div>
      </RestrictUser>
    </div>
  );
};

export default Groups;