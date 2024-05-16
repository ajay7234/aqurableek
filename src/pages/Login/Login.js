import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  signInWithDetails,
  signInWithGoogleProvider,
} from "../../helper/authentication";
import { useAuth } from "../../authContext/AuthContext";

export const Login = () => {
  const [Input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateValues = (inputValues) => {
    let errors = {};
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!inputValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!inputValues.email.match(isValidEmail)) {
      errors.email = "Email is not valid";
    }
    if (inputValues.password.length < 8) {
      errors.password = "Password should contain at least 8 characters";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const newErrors = validateValues(Input);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const email = Input.email;
      const password = Input.password;
      try {
        const logIn = await signInWithDetails(email, password);
        localStorage.setItem("AuthToken", logIn.multiFactor.user.accessToken);
        setIsAuthenticated(true);

        if (logIn) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("error occurred while login to this app", error);
      }
    }
  };

  const signInWithGoogle = async () => {
    const response = await signInWithGoogleProvider();
    if (response) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="sm:shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] max-w-[500px] w-full mx-auto p-[20px] relative">
        {/*<button className="text-[#EF9595] text-[20px] absolute left-[20px] top-[35px]">
          <FaArrowLeft />
        </button>*/}
        <h1 className="text-[#EF9595] text-[30px] font-bold text-center">
          Sign In
        </h1>
        <div className="mt-[70px] sm:px-[30px]">
          <input
            type="email"
            placeholder="Enter Email"
            className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px] mt-[24px]"
            name="email"
            value={Input.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-[#e50000] text-[13px] block ml-5">
              {errors.email}
            </span>
          )}
          <input
            type="password"
            placeholder="password (8 signs minimum)"
            className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] mt-[24px] focus:border-[#EF9595] border-[1px]"
            name="password"
            value={Input.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-[#e50000] text-[13px] block ml-5">
              {errors.password}
            </span>
          )}
          <button
            className="bg-[#EF9595] text-[#fff] h-[48px] font-semibold w-full mt-[36px] rounded-[30px] active:bg-[#2c7cf7]"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <div className="flex justify-center">
            <Link
              to="/forget"
              className="text-[#EF9595] font-semibold block w-fit text-center mt-[60px] p-[10px] hover:bg-[#ffeeee] rounded-full trans"
            >
              Forget Password?
            </Link>
          </div>
          <div>
            <Link
              to="/signup"
              className="text-[14px] text-blue-500 flex justify-end"
            >
              Sign Up
            </Link>
          </div>
          <div className="bg-[#323232] h-[1px] w-full mt-[13px]"></div>
          <div className="flex justify-center my-[40px]">
            <button
              className="flex gap-[20px] shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] justify-center items-center p-[10px] text-slate-500 font-semibold hover:bg-[#ffeeee] trans"
              onClick={() => signInWithGoogle()}
            >
              <FcGoogle className="text-[24px]" /> Log in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
