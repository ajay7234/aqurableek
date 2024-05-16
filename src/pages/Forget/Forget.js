import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/Firebase";
import { toast } from "react-toastify";

const Forget = () => {
  const navigate = useNavigate();
  const [Input, setInput] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });

  const validateValues = (InputValue) => {
    let errors = {};
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!InputValue.email.match(isValidEmail)) {
      errors.email = "Email is not valid";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevVal) => ({
      ...prevVal,
      [name]: value,
    }));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    const newErrors = validateValues(Input);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        await auth.sendPasswordResetEmail(Input.email);
        toast.success("Reset password link sent on your email address");
        setInput({
          email: "",
        });
        navigate("/");
      } catch (error) {
        let errorMessage = error.message;
        errorMessage = errorMessage.replace("Firebase: ", "");
        errorMessage = errorMessage.replace(/ *\([^)]*\) */g, "");
        toast.error(errorMessage);
        console.error(error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="sm:shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] max-w-[500px] w-full mx-auto sm:p-[20px] p-[10px] relative">
        <button
          className="text-[#EF9595] text-[20px] absolute sm:left-[20px] left-[8px] sm:top-[35px] top-[22px]"
          onClick={() => navigate("/login")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-[#EF9595] text-[30px] font-bold text-center">
          Forget Password
        </h1>
        <div className="mt-[60px]">
          <h2 className="text-[#212121] text-[20px] text-center">
            Forget Password
          </h2>
          <p className="text-[#aaa] text-center mt-[10px] font-light max-w-[220px] mx-auto">
            Enter your email address below to recieve password reset instruct
          </p>
        </div>
        <div className="my-[50px] sm:px-[30px]">
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
          <button
            className="bg-[#EF9595] text-[#fff] h-[48px] font-semibold w-full mt-[36px] rounded-[30px] active:bg-[#2c7cf7]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forget;
