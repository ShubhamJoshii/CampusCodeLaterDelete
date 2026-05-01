import React, { useEffect } from 'react'
import "./auth.css";
import { useDispatch } from 'react-redux';
import { resetData } from '../../redux/reducer/userSlice';

const AuthWrapper = ({children}) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(resetData())
    },[])
    return (
        <div className='authContainer'>
            <div className='authContainer-inner'>
                {children}
            </div>
        </div>
    )
}

export default AuthWrapper