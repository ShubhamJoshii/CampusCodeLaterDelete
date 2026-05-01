import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { Edit3, Moon } from "lucide-react";
import "./Settings.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeEmail, changeModal, changeModalData, changePassword, changeUsername, deleteAccount, fetchSettingDetails, resetModalData } from "../../redux/reducer/settingSlice";
import { logoutUser } from "../../redux/reducer/userSlice";
import { toast } from 'react-toastify';


const lastActive = (date1) => {
  const date = new Date(date1);
  const datePart = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} at ${timePart}`;
}

function Settings() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showSessions, setShowSessions] = useState(false);
  const dispatch = useDispatch();
  const { setting, modal, modalData } = useSelector(state => state.settings);
  useEffect(() => {
    dispatch(fetchSettingDetails())
  }, [])

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
    localStorage.clear();
  };

  const deleteUser = async () => {
    try {
      let response = await dispatch(deleteAccount()).unwrap();
      toast.success(response?.msg);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.log(error);
      toast.error(error?.msg?.message || error?.msg || "Server Not Working");
    }
  }

  const submitBtn = async () => {
    try {
      let response;
      if (modal == "username") {
        response = await dispatch(changeUsername()).unwrap();
      } else if (modal === "email") {
        response = await dispatch(changeEmail()).unwrap();
      } else if (modal === "updatepassword") {
        response = await dispatch(changePassword()).unwrap();
      }else if(modal === "deleteAccount"){
        deleteUser();
        return;
      }
      toast.success(response?.msg);

      dispatch(fetchSettingDetails())
      dispatch(changeModal(""));
      dispatch(resetModalData());
    } catch (error) {
      console.log(error);
      toast.error(error?.msg?.message || error?.msg || "Server Not Working");
    }
  }

  

  return (
    <div className="mainContent hide-scrollbar settings-container gap-0">
      {modal != "" && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3 className="modal-title">
              {modal === "username"
                ? "Edit Username"
                : modal === "email"
                  ? "Edit Email"
                  : "Update Password"}
            </h3>

            {modal === "username" && (
              <div className="modal-field">
                <label>Username</label>
                <input
                  type="text"
                  value={modalData.username || ""}
                  onChange={(e) => dispatch(changeModalData({ target: "username", value: e.target.value }))}
                  placeholder="Enter new username"
                />
              </div>
            )}
            {modal === "email" && (
              <div className="modal-field">
                <label>Email</label>
                <input
                  type="email"
                  value={modalData.email || ""}
                  onChange={(e) => dispatch(changeModalData({ target: "email", value: e.target.value }))}
                  placeholder="Enter new email"
                />
              </div>
            )}

            {(modal == "username" || modal == "email") &&
              <div className="modal-field">
                <label>Password</label>
                <input
                  type="password"
                  value={modalData.password || ""}
                  onChange={(e) => dispatch(changeModalData({ target: "password", value: e.target.value }))}
                  placeholder="Enter password to confirm identity"
                />
              </div>
            }
            {modal === "updatepassword" && (
              <>
                <div className="modal-field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={modalData.password || ""}
                    onChange={(e) => dispatch(changeModalData({ target: "password", value: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
                <div className="modal-field">
                  <label>New Password</label>
                  <input
                    type="email"
                    value={modalData.newpassword || ""}
                    onChange={(e) => dispatch(changeModalData({ target: "newpassword", value: e.target.value }))}
                    placeholder="Enter new email"
                  />
                </div>
                <div className="modal-field">
                  <label>Confirm new Password</label>
                  <input
                    type="email"
                    value={modalData.newconfirmpassword || ""}
                    onChange={(e) => dispatch(changeModalData({ target: "newconfirmpassword", value: e.target.value }))}
                    placeholder="Enter new email"
                  />
                </div>
              </>
            )}
            {modal === "deleteAccount" && (
              <div className="modal-field">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </div>
            )}
            <div className="modal-actions mt-10!">
              <button className="cancel-btn" onClick={() => {
                dispatch(changeModal(""));
                dispatch(resetModalData())
              }}>
                Cancel
              </button>

              <button
                className={`save-btn ${modal === "deleteAccount" && "bg-[#ef4444]!"}`}
                onClick={submitBtn}
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="settings-header">
        <h1>Settings</h1>

        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft />
          Back
        </button>
      </div>

      {/* PROFILE */}
      <div className="card">
        <h2>Profile</h2>

        <div className="row row-border">
          <div className="row-left">
            <FiUser />
            <span>Username</span>
          </div>
          <div className="row-right">
            <span>{setting?.userName || "username"}</span>
            <Edit3 className="w-4 h-4" onClick={() => {
              dispatch(changeModalData({ target: "username", value: setting?.userName }));
              dispatch(changeModal("username"))
            }} />
          </div>
        </div>

        <div className="row row-border">
          <div className="row-left">
            <FiMail />
            <span>Email</span>
          </div>
          <div className="row-right">
            <span>{setting?.email || "email"}</span>
            <Edit3 className="w-4 h-4" onClick={() => {
              dispatch(changeModalData({ target: "email", value: setting?.email }));
              dispatch(changeModal("email"))
            }} />
          </div>
        </div>
      </div>

      {/* CAMPUS CODE FEATURES */}
      {/* <div className="card">
        <h2>Campus Code</h2>

        <div className="row row-hover">
          <span>My Groups</span>
          <FiChevronRight />
        </div>

        <div className="row row-hover">
          <span>Create Group</span>
          <FiChevronRight />
        </div>

        <div className="row row-hover">
          <span>Competition History</span>
          <FiChevronRight />
        </div>

        <div className="row row-hover">
          <span>Leaderboard Settings</span>
          <FiChevronRight />
        </div>
      </div> */}

      {/* SECURITY */}
      <div className="card">
        <h2>Security</h2>

        <div className="row row-hover">
          <span>Change Password</span>
          <Edit3 className="w-4 h-4 text-gray-600" onClick={() => {
            dispatch(resetModalData());
            dispatch(changeModal("updatepassword"))
          }} />
        </div>

        {/* ACTIVE SESSIONS DROPDOWN */}
        <div
          className="row row-hover"
          onClick={() => setShowSessions(!showSessions)}
          style={{ cursor: "pointer" }}
        >
          <span>Active Sessions</span>
          <FiChevronDown
            className={showSessions ? "rotate" : ""}
          />
        </div>

        {/* DROPDOWN CONTENT */}
        {showSessions && <> {
          setting?.setting?.map((curr, id) => {
            return <div className="session-dropdown" key={id}>
              <div className="session-item">
                <div>
                  <strong>{curr.deviceInfo.browser} - {curr.deviceInfo.os}</strong>
                  <p>Last Active: {lastActive(curr.lastActiveAt)}{curr.isCurr && <span className="uppercase text-green-500 font-bold"> (current)</span>}</p>
                </div>
                {curr.isCurr &&
                  <button className="logout-session" onClick={logout}>Logout</button>
                }
              </div>
            </div>
          })
        }
        </>
        }
      </div>

      {/* CONNECTED ACCOUNTS */}
      {/* <div className="card">
        <h2>Connected Accounts</h2>

        <div className="row">
          <span>Google</span>
          <button className="connect-btn connected">Connected</button>
        </div>

        <div className="row">
          <span>GitHub</span>
          <button className="connect-btn">Connect</button>
        </div>

        <div className="row">
          <span>LinkedIn</span>
          <button className="connect-btn">Connect</button>
        </div>
      </div> */}


      {/* DANGER */}
      <div className="danger">
        <h2>Delete this account</h2>
        <p>
          Once you delete your Campus Code account, there is no going back.
          Please be certain.
        </p>

        <button
          className="delete-btn"
          onClick={() => dispatch(changeModal("deleteAccount"))}
        >
          Delete Account
        </button>
      </div>
    </div >

  );
}

export default Settings;