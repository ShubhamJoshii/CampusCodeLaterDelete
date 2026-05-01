import React, { useEffect, useState } from 'react'
import ProblemList from '../../components/ProblemList/ProblemList';
import { useDispatch, useSelector } from 'react-redux';

import "./Problems.css"
import { changeDifficulty, fetchProblems, searchProblems } from '../../redux/reducer/problemsSlice';
import Loading from '../Loading';
import { changeLimit, changePage, changeTag } from '../../redux/reducer/problemsSlice';

const Problems = () => {
    const [search, setSearch] = useState("");
    const [difficultyState, setDifficultyState] = useState("");

    const { problemsList, totalPages, tag, difficulty, attemptedProblemsCount, status, totalProblems, limit, pageNo, categories } = useSelector((state) => state.problems);
    const props = {
        problemsList,
        totalPages,
        tag,
        attemptedProblemsCount,
        status,
        totalProblems,
        limit,
        pageNo,
        categories,
        changePage, changeLimit, changeTag
    };


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProblems());
    }, [pageNo, limit, difficulty, tag]);

    useEffect(() => {
        if (!search?.trim()) {
            dispatch(fetchProblems());
            return;
        }

        const delay = setTimeout(() => {
            dispatch(searchProblems(search));
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        if (difficultyState?.length > 0) {
            dispatch(changeDifficulty(difficultyState));
            dispatch(fetchProblems());
        }
    }, [difficultyState]);
    return (
        <div className="mainContent hide-scrollbar">
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search problems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="searchInput"
                />

                <select
                    onChange={(e) => setDifficultyState(e.target.value)}
                    className="difficultySelect"
                >
                    <option value="all">All Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <ProblemList {...props} />
        </div>
    );
}




export default Problems;