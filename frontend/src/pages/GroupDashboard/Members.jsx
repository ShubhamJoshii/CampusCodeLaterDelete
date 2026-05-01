import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";
import "./members.css"
import React, { useEffect, useState } from "react";
import { changeLimitMembers, changePageMembers } from "../../redux/reducer/groupSlice";
import Loading from "../Loading";

const groups = ["All", "Frontend", "Backend", "AI"];

const MembersList = () => {
    const [activeGroup, setActiveGroup] = useState("All");
    const [search, setSearch] = useState("");
    const { membersDetails, pageMembers, status, limitMembers, totalPagesMembers, totalMembers } = useSelector(state => state.groups);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const changePagination = (page) => {
        dispatch(changePageMembers(page));
    }

    const changePaginationLimit = (count) => {
        dispatch(changeLimitMembers(count));
    }
    if (status == "loading") {
        return <Loading style="flex-1 !h-[100%] bg-white" />
    }
    // return <Loading style="flex-1 !h-[inherit] bg-white" />

    return (
        <div className="members-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <p>Total Members {totalMembers}</p>
            </div>

            {/* MEMBERS LIST */}
            <div className="members-list">
                {membersDetails?.map((curr, index) => (
                    <div key={index} className={`member-row ${(curr?.userName == user?.userName )?"active" :""}`}>
                        <span className="name">
                            {(index + 1) + ((pageMembers - 1) * limitMembers)}. {curr.firstName + " " + curr.lastName} <span className="text-blue-500 ">({curr.userName})</span>
                            {
                                curr?.userName == user?.userName &&
                                <span className="roleAdmin ml-3 rounded-lg bg-green-400! text-white!">
                                    you
                                </span>
                            }
                        </span>


                        {
                            curr?.role == "admin" &&
                            <div className="roleAdmin ml-2">
                                {curr?.role}
                            </div>
                        }
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div className="footer">
                <Pagination totalPages={totalPagesMembers} initialPage={pageMembers} limit={limitMembers} changePagination={changePagination} changePaginationLimit={changePaginationLimit} />
            </div>
        </div>
    );
};

export default MembersList;