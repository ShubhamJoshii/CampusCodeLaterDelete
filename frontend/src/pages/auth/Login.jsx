import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from 'react-router-dom';
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, loginUser, sendOTP, userExist, verifyOTP } from '../../redux/reducer/userSlice';

import SubmitBtn from './SubmitBtn';
import ForgetPassword from './ForgetPassword';
import { toast } from 'react-toastify';
import AuthWrapper from './AuthWrapper';

const Content = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { status, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data1) => {
        try {
            const response = await dispatch(loginUser(data1)).unwrap();
            toast.success(response?.msg || "Login successful");
            // setTimeout(() => window.location.href = "/", 1000);
        } catch (error) {
            toast.error(error?.msg?.message || "Login failed");
        }
    };

    return (
        <>
            {/* <h1 className='authHeading'>Login</h1> */}
            <div className="auth-header">
                <h1 className='authHeading'>Welcome Back</h1>
                <p className="authSubHeading">Please enter your details to sign in.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Input
                    Text={"Email"}
                    name={"Email"}
                    type={"text"}
                    errors={errors}
                    {...register("email", {
                        required: "Email is required",
                    })}
                />
                <Input
                    Text={"Password"}
                    name={"Password"}
                    type={"password"}
                    password={true}
                    errors={errors}
                    {...register("password", {
                        required: "Password is required",
                    })}
                />
                <button type="button" className='text-[#ecb014] text-right text-[14px] font-semibold hover:text-[#ecaf14bd] cursor-pointer' onClick={() => {
                    console.log("Click");
                    navigate("/forgotPassword");
                }}>Forgot Password?</button>

                <SubmitBtn text={"Login"} />
            </form>

            <p className='auth-footer-text'>Don't have an account?
                <NavLink to="/signup" className="signup-link"> Sign Up</NavLink>
            </p>
        </>
    )
}

const Login = () => {
    const { page } = useSelector((state) => state.user);
    return (
        <AuthWrapper>
            <Content />
        </AuthWrapper>
    )
}

export default Login;