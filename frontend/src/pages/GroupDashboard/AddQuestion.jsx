import React, { useEffect, useRef, useState } from "react";
import "./AddQuestion.css";
import { useDispatch, useSelector } from "react-redux";
import { addProblem, changeProblemTag, fetchAllProblems } from "../../redux/reducer/groupSlice";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, Timer } from "lucide-react";
import Loading from "../Loading";

const questionBank = [
    { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["array"] },
    { id: 2, title: "Longest Substring", difficulty: "Medium", tags: ["string"] },
    { id: 3, title: "Merge K Lists", difficulty: "Hard", tags: ["linked-list"] },
    { id: 4, title: "Valid Parentheses", difficulty: "Easy", tags: ["stack"] },
];

const AddQuestion = () => {
    const { _id } = useParams();
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("today");
    const [filteredData, setFilteredData] = useState([])
    const [showDateInput, setShowDateInput] = useState(false);
    const [selected, setSelected] = useState(null);

    const [openId, setOpenId] = useState(null);
    const { allProblems, problemsTag, status } = useSelector(state => state.groups);

    const dispatch = useDispatch();


    useEffect(() => {
        const filtered = allProblems.filter((q) => {

            // 🔍 search match
            const matchesSearch = q.title
                .toLowerCase()
                .includes(search.toLowerCase());

            // 🏷 tag match
            const matchesTag =
                problemsTag === "all" || q.tags.includes(problemsTag);

            // ⚡ difficulty match
            const matchesDifficulty =
                filter === "ALL" || q.difficulty.toUpperCase() === filter;

            return matchesSearch && matchesTag && matchesDifficulty;
        });

        setFilteredData(filtered);
    }, [allProblems, search, problemsTag, filter]);

    const handleAdd = () => {
        if (!selected) return alert("Select a question first");
    };

    const categoriesSet = new Set();
    allProblems.forEach((p) => {
        if (Array.isArray(p.tags)) {
            p.tags.forEach((t) => categoriesSet.add(t));
        }
    });
    const categories = ["all", ...categoriesSet];

    useEffect(() => {
        dispatch(fetchAllProblems(_id));
    }, [])

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    const handleAddQuestion = async (problemId) => {
        let dateToSubmit = new Date();
        if (!showDateInput) {
            if (date === "tomorrow") {
                dateToSubmit.setDate(dateToSubmit.getDate() + 1);
            }
        } else {
            dateToSubmit = new Date(date);
        }

        dateToSubmit.setUTCHours(0, 0, 0, 0);

        const formattedDate = dateToSubmit.toISOString();
       
        try {
            await dispatch(addProblem({ _id, problemId, date: formattedDate })).unwrap();
            dispatch(fetchAllProblems(_id));
        } catch (error) {
            console.error("Error adding problem:", error);
        }
    };
    if (status == "loading") {
        return <Loading style="flex-1 !h-[100%] bg-white" />
    }


    return (
        <div className="addGroupQuestion mx-3">
            <div className="flex gap-5 mb-2.5">
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <div className="filter-bar">
                    {["ALL", "EASY", "MEDIUM", "HARD"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`filter-btn ${filter === item ? "active" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
            <div className="topicBar">
                <span className="topicTitle">Topics</span>
                <div className="topicScrollWrapper">
                    <button onClick={() => scroll('left')} className="scrollBtn">
                        <ChevronLeft size={18} color="#9ca3af" />
                    </button>

                    <div ref={scrollRef} className="topicScroll">
                        {categories?.map((curr) => (
                            <button
                                key={curr}
                                onClick={() => dispatch(changeProblemTag(curr))}
                                className={`topicBtn ${problemsTag === curr ? 'active' : ''}`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => scroll('right')} className="scrollBtn">
                        <ChevronRight size={18} color="#9ca3af" />
                    </button>
                </div>
            </div>

            <div className="question-list-container hide-scrollbar">
                <div className="question-list">
                    {filteredData?.map((q, id) => (
                        <div key={id}>
                            <div
                                className={`question-row ${selected?._id === q._id ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setSelected(q);
                                    setOpenId(openId === q._id ? null : q._id);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <pre>{q.sno || (id)}</pre>
                                    <span className="title">{q.title}</span>
                                    <div className="attemptIcon relative inline-block">
                                        {q.isSchduled && (
                                            <Clock className="text-yellow-400 w-3.5 h-3.5" />
                                        )}

                                        <span className="tooltip">
                                            {new Date(q.isSchduled).toDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="tags">
                                    <span className={`difficulty ${q.difficulty.toLowerCase()}`}>
                                        {q.difficulty}
                                    </span>
                                    {q.tags.map((tag, i) => (
                                        <span key={i} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 🔽 DROPDOWN */}
                            <div className={`dropdown ${openId === q._id ? "open" : ""}`}>
                                    <p className="text-sm"><b>Description:</b> {q?.description}</p>
                                {q.isSchduled && <p className="text-sm text-gray-800">Previous Scheduled for <b>{new Date(q.isSchduled).toDateString()}</b></p>}
                                <div className="flex justify-between">

                                    <div className="dropdown-left">
                                        <button className={`${!showDateInput && date == "today" ? "active" : ""}`} onClick={() => { setDate("today"); setShowDateInput(false); }}>Today</button>
                                        <button className={`${!showDateInput && date == "tomorrow" ? "active" : ""}`} onClick={() => { setDate("tomorrow"); setShowDateInput(false); }}>Tomorrow</button>

                                        <button className={`${showDateInput ? "active" : ""}`} onClick={() => setShowDateInput(!showDateInput)}>
                                            Select Date
                                        </button>

                                        {showDateInput && (
                                            <input
                                                type="date"
                                                className="date-input"
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <div className="dropdown-right">
                                        <button className="confirm" onClick={() => handleAddQuestion(q._id)}>Add Question</button>
                                    </div>
                                </div>


                            </div>

                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default AddQuestion;