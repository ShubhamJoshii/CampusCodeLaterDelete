import React from "react";
import { NavLink } from "react-router-dom";

import Input from "../../components/Input/Input";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import HashLoader from "react-spinners/HashLoader";

import {
    deleteUser, registerUser,
    // resendOtp, 
    updatePage
} from "../../redux/reducer/userSlice";

import './auth.css'

const Content = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        // Handle form submission here (e.g., send data to an API)
    };

    const { user, error, status } = useSelector((state) => state.user);
    return (
        <>
            <div
                onClick={() => { dispatch(deleteUser(user?._id)) }}
                className="flex items-center gap-2 text-base text-gray-600 hover:text-black cursor-pointer mb-6"
            >
                <HiOutlineChevronLeft className="text-xl" />
                <p>Back to sign up</p>
            </div>
            <div className="auth-header">
                <h1 className='authHeading'>Verification Email</h1>
                {/* <p className="authSubHeading">Join us today! Please fill in your details.</p> */}
            </div>
            {/* <h1 className="authHeading">Verification Email</h1> */}
            <p className="text-base text-gray-600 mb-4">
                Verification email has been sent to:
            </p>
            <div className="flex items-center text-base mb-8">
                <span className="text-gray-800 font-medium">{user?.email}</span>
                <span
                    onClick={() => dispatch(deleteUser(user?._id))}
                    className="text-blue-500 cursor-pointer hover:underline"
                >
                    (edit)
                </span>
            </div>
            {/* <form>
                <p className="text-base text-gray-600">
                    Didn’t receive a code?{" "}
                    <span
                        // onClick={() => dispatch(resendOtp(_id))}
                        className="text-blue-500 cursor-pointer hover:underline ml-3"
                    >
                        Resend
                    </span>
                </p>
            </form> */}
            {error?.target === "OTP" && (
                <p className="text-red-500 text-base mt-5">
                    {error?.message}
                </p>
            )}
        </>
    );
};

const Content2 = () => {
    return (
        <>
            <div className="auth-header">
                <h1 className='authHeading'>Email Verified</h1>
            </div>
            <p className="text-base text-gray-600 mb-8">
                Your verification email has been successfully verified.
            </p>
            <NavLink
                to="/login"
                className="inline-block bg-[#ECB014] hover:bg-yellow-500 text-center font-bold text-white text-base px-6 py-2 rounded-md transition"
            >
                LOGIN
            </NavLink>
        </>
    );
};

const Content3 = () => {
    return (
        <>
            <div className="auth-header">
                <h1 className='authHeading'>Email Already Verified</h1>
            </div>
            <p className="text-base text-gray-600 mb-8">Verfication email has been Already Verified </p>
            {/* <p className="text-base text-gray-600"> Continue with login </p> */}
            <NavLink
                to="/login"
                className="inline-block bg-[#ECB014] hover:bg-yellow-500 text-center font-bold text-white text-base px-6 py-2 rounded-md transition"
            >
                LOGIN
            </NavLink>
        </>
    );
};

const VerifyEmail = () => {
    const { page } = useSelector((state) => state.user);
    return (
        <>
            {page === "SendedVerificationMail" && (
                <Content />
            )}
            {page === "EmailVerified" && (
                <Content2 />
            )}
            {page === "alreadyVerified" && (
                <Content3 />
            )}
        </>
    );
};
export default VerifyEmail;