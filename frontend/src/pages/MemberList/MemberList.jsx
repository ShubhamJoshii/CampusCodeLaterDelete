import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MemberList.css";
import Input from "../../components/Input/Input";
import { useForm } from "react-hook-form";

function MemberList() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Toggle popup
const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
  const [members, setMembers] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Member" },
  ]);

  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const memberToAdd = {
      id: Date.now(),
      ...newMember,
      role: "Member",
    };

    setMembers([...members, memberToAdd]);
    setNewMember({ name: "", email: "" });
    setShowModal(false); // Close popup after adding
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="member-header">
          <div>
            <h1 className="member-title">Group Members 👥</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="open-modal-btn" onClick={() => setShowModal(true)}>
              + Add Member
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{ cursor: 'pointer', background: 'none', border: '1px solid white', color: 'white', padding: '8px 16px', borderRadius: '8px' }}
            >
              Back
            </button>
          </div>
        </div>

        {/* POPUP MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 style={{ margin: 0 }}>Add New Member</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleAddMember} className="modal-form">
                <Input
                  Text={"Email"}
                  name={"Email"}
                  type={"text"}
                  errors={errors}
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {/* <label>Full Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. John Doe"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />

                <label>Email Address</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="john@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                /> */}

                <button type="submit" className="modal-submit-btn">
                  Confirm & Add
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          <table className="member-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`role-badge ${member.role === 'Admin' ? 'role-admin' : 'role-member'}`}>
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberList;