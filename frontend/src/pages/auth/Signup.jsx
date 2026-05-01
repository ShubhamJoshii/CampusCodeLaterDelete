import React from 'react'
import Input from '../../components/Input/Input'
import { useForm } from "react-hook-form";
import { NavLink, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, updatePage } from '../../redux/reducer/userSlice';
import VerifyEmail from './VerifyEmail';
import { Oval } from "react-loader-spinner";
import { useEffect } from 'react';

import SubmitBtn from './SubmitBtn';
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

    const onSubmit = async (data) => {
        try {
            const response = await dispatch(registerUser(data)).unwrap();
            toast.success(response?.msg || "Register successful");
        } catch (error) {
            // console.log(error);
            toast.error(error?.msg?.message || "Register failed");
        }
    };

    return (
        <>
            <div className="auth-header">
                <h1 className='authHeading'>Create Account</h1>
                <p className="authSubHeading">Join us today! Please fill in your details.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="twoInputWrapper">
                    <Input
                        Text={"First Name"}
                        name={"FirstName"}
                        type={"text"}
                        errors={errors}
                        {...register("firstName", {
                            required: "First Name is required",
                        })}
                    />
                    <Input
                        Text={"Last Name"}
                        name={"LastName"}
                        type={"text"}
                        errors={errors}
                        {...register("lastName", {
                            required: "LastName is required",
                        })}
                    />
                </div>
                <div className="twoInputWrapper w-full">
                    <Input
                        Text={"Email"}
                        name={"Email"}
                        type={"text"}
                        errors={errors}
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                </div>
                <div className="twoInputWrapper">
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
                    <Input
                        Text={"Confirm Password"}
                        name={"Confirm Password"}
                        type={"password"}
                        password={true}
                        errors={errors}
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                        })}
                    />
                </div>
                <SubmitBtn text={"Create Account"} />
            </form>
            {/* <p className='text-center'>Already have an account? <NavLink to={"/login"} className="text-blue-700  font-semibold  ">Login</NavLink></p> */}
            <p className='auth-footer-text'>
                Already have an account?
                <NavLink to="/login" className="signup-link"> Login</NavLink>
            </p>
        </>
    )
}

const Register = () => {
    const { page } = useSelector((state) => state.user);
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updatePage(status));
    }, [])
    return (
        <AuthWrapper>
            {page === "SendedVerificationMail" ||
                page === "EmailVerified" ||
                page === "alreadyVerified" ? (
                <VerifyEmail />
            ) : (
                <Content />
            )}
        </AuthWrapper>
    )
}

export default Register;