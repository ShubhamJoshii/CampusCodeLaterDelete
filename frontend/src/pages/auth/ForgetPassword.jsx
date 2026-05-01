import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import SubmitBtn from './SubmitBtn';
import Input from '../../components/Input/Input';
import { updatePassword, sendOTP, verifyOTP } from '../../redux/reducer/userSlice';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import AuthWrapper from './AuthWrapper';

const Content = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const [page, setPage] = useState("forgetPassword");
    const [forgetData, setforgetData] = useState({
        otpID: "",
        OTP: new Array(6).fill(""),
    });

    const { user, status, error, otpID } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelOTP = (e, index) => {
        if (isNaN(e.target.value)) return false;
        setforgetData({ ...forgetData, OTP: [...forgetData.OTP.map((user, idx) => (idx === index ? e.target.value : user))] });
        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };

    const handleOTPBackspace = (e, index) => {
        const { key } = e;
        if (key === "Backspace" && (forgetData.OTP[index] === null || forgetData.OTP[index] === "") && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const onSendOTP = async (data) => {
        try {
            const response = await dispatch(sendOTP(data)).unwrap();
            toast.success(response?.msg || "OTP sent successfully");
            setPage("forgetPasswordOTP");
        } catch (error) {
            toast.error(error?.msg?.message || "Failed to send OTP");
        }
    };

    const resendOTP = async (data1) => {
        try {
            const response = await dispatch(sendOTP({ email: user?.email })).unwrap();
            toast.success(response?.msg || "OTP sent successfully");
        } catch (error) {
            toast.error(error?.msg?.message || "Failed to send OTP");
        }
    };


    const onVerifyOTP = async (data) => {
        setforgetData({ ...forgetData, otpID: otpID });
        try {
            const payload = { ...data, otpID, OTP: forgetData.OTP.join("") };
            const response = await dispatch(verifyOTP(payload)).unwrap();
            toast.success(response?.msg || "OTP verified successfully");
            setPage("forgetPasswordNew");
        } catch (error) {
            toast.error(error?.msg?.message || "OTP verification failed");
        }
    };

    const onUpdatePassword = async (data) => {
        try {
            const response = await dispatch(updatePassword(data)).unwrap();
            toast.success(response?.msg || "Password updated successfully! Now Login");
            navigate("/login");
        } catch (error) {
            toast.error(error?.msg?.message || "Password update failed");
        }
    };

    return (
        <>
            <div className="auth-header">
                <h1 className='authHeading'>Forget Password</h1>
                <p className="authSubHeading w-100 mb-8">Enter your email address that you used to register. We'll send you an email with a link to reset your password. If you don’t see the email, check other places it might be, like your junk, spam, social, or other folders.</p>
            </div>

            {page == "forgetPassword" &&
                <form onSubmit={handleSubmit(onSendOTP)} className='flex flex-col  gap-3 '>
                    <Input
                        Text={"Email"}
                        name={"Email"}
                        type={"text"}
                        errors={errors}
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />
                    <SubmitBtn text={"SEND OTP"} />
                </form>
            }
            {page == "forgetPasswordOTP" &&
                <form onSubmit={handleSubmit(onVerifyOTP)} className='flex flex-col  gap-3 '>
                    <span className="text-gray-800 font-medium">{user?.email}</span>
                    <div className='flex justify-between w-full'>
                        {forgetData.OTP.map((curr, id) => {
                            return <input type="text" key={id} id="otp" className='mt-3.5 w-12.5 aspect-square text-center border border-[#0000009f] rounded-md  ' name="otp" value={curr} maxLength={1} placeholder="_" onChange={(e) => handelOTP(e, id)} onKeyDown={(e) => handleOTPBackspace(e, id)} />;
                        })}
                    </div>
                    {(error?.target === "All") && <p id="formErrorMsg">{error.message}</p>}
                    <button type="button" className='text-[#ecb014] text-right text-[14px] font-semibold hover:text-[#ecaf14bd] cursor-pointer tracking-wide' onClick={resendOTP}>Resend OTP</button>

                    <SubmitBtn text={"VERIFY OTP"} />

                </form>
            }
            {page == "forgetPasswordNew" &&
                <form onSubmit={handleSubmit(onUpdatePassword)} className='flex flex-col  gap-3 '>
                    <p>{user?.email}</p>
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
                    <SubmitBtn text={"Update Password"} />
                </form>
            }
        </>
    )
}

const ForgetPassword = () => {
    return <AuthWrapper>
        <Content />
    </AuthWrapper>
}


export default ForgetPassword