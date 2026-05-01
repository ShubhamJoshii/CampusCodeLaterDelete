import React, { useState } from 'react';
import "./CreateGroup.css";
import { useDispatch, useSelector } from 'react-redux';
import { createGroupName, createNewGroup, fetchGroups } from '../../redux/reducer/groupSlice';

const CreateGroup = ({ createGroupShow, setCreateGroupShow }) => {
    const [isCreated, setIsCreated] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const { groups, status, groupName, invitationCode } = useSelector(state => state.groups);
    const dispatch = useDispatch();

    const handleCreateSubmit = async () => {
        try {
            await dispatch(createNewGroup()).unwrap();
            setIsCreated(true);
            await dispatch(fetchGroups()).unwrap();
            // setCreateGroupShow(false);

        } catch (error) {
            console.log(error);
        }
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}/join/${invitationCode}`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    function formatCode(str) {
        return str
            ?.toUpperCase()
            .match(/.{1,4}/g)
            ?.join(" ") || "";
    }

    return (
        <>
            {createGroupShow && (
                <div className="overlay">
                    <div className="modal">
                        {!isCreated ? (
                            <>
                                <div className="header">
                                    <h2>Create a Squad</h2>
                                    <p>Ready to start something big?</p>
                                </div>

                                <div className="input-group">
                                    <label>Group Name</label>
                                    <input
                                        autoFocus
                                        value={groupName}
                                        maxLength={30}
                                        onChange={(e) => dispatch(createGroupName(e.target.value))}
                                        placeholder="e.g. Alpha Coders"
                                    />
                                    <p className="warning">
                                        {groupName.length > 0 && groupName.length < 3 && "⚠️ Minimum 3 characters required"}
                                    </p>
                                </div>

                                <div className="buttons">
                                    <button className="cancel-btn" onClick={() => setCreateGroupShow(false)}>
                                        Cancel
                                    </button>

                                    <button
                                        disabled={groupName.length < 3 || status === "loading"}
                                        onClick={handleCreateSubmit} // ✅ Updated reference
                                        className="create-btn"
                                    >
                                        {status === "loading" ? "Creating..." : "Create Now"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="success">
                                <div className="icon">✅</div>
                                <h2>Squad Created!</h2>
                                <p>Share these details with your teammates.</p>

                                <div className="invite-box">
                                    <span>Invitation Code</span>
                                    <div className="code">{formatCode(invitationCode)}</div>
                                </div>

                                <div className="share-box">
                                    <div className="share-header">
                                        <span>Quick Share</span>
                                        {copySuccess && <span className="copied">Copied!</span>}
                                    </div>

                                    <div className="share-input">
                                        <p>{window.location.origin}/join/{invitationCode}</p>
                                        <button onClick={copyToClipboard}>Copy</button>
                                    </div>
                                </div>

                                <button
                                    className="done-btn"
                                    onClick={() => {
                                        setIsCreated(false);
                                        setCreateGroupShow(false);
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateGroup;