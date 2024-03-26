import React, { useState, Fragment } from "react";
import { FaAngleDown, FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import ReactFlagsSelect from "react-flags-select";
import countries from "../../json/country.json";
import { createUser, signUpWithDetails } from "../../helper/authentication";
import { createdDate } from "../../helper/fetchTweetData";
import CreateTweet from "../../components/Modals/CreateTweet";
import { toast } from "react-toastify";

const people = [
  { id: 0, name: "Select Language to Speak" },
  { id: 1, name: "English worlds" },
  { id: 2, name: "Arabic worlds" },
];

const gender = [
  { id: 0, name: "Select gender" },
  { id: 1, name: "Female" },
  { id: 2, name: "Male" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SignUp = () => {
  const [Input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bdate: "",
    country: "",
    language: people[0],
    gender: gender[0],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(false);
  const [userId, setUserId] = useState("");

  const handleChange = (e, fieldName = "") => {
    if (fieldName) {
      setInput((prevVal) => ({
        ...prevVal,
        [fieldName]: e,
      }));
      setErrors({ ...errors, [fieldName]: "" });
    } else {
      const { name, value } = e.target;
      setInput((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateValues = (inputValues) => {
    let errors = {};
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!inputValues.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!inputValues.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!inputValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!inputValues.email.match(isValidEmail)) {
      errors.email = "Email is not valid";
    }
    if (inputValues.password.length < 8) {
      errors.password = "Password should contain at least 8 characters";
    }
    if (inputValues.confirmPassword !== inputValues.password) {
      errors.confirmPassword = "Passwords do not match";
    } else if (!inputValues.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    }
    if (!inputValues.bdate.trim()) {
      errors.bdate = "Birth date is reqired";
    }
    if (!inputValues.country.trim()) {
      errors.country = "Select a country";
    }
    if (inputValues.language.id === 0) {
      errors.language = "Select a language";
    }
    if (inputValues.gender.id === 0) {
      errors.gender = "Select a gender";
    }

    return errors;
  };

  const handleSubmit = async () => {
    const newErrors = validateValues(Input);
    setErrors(newErrors);
    if (Object.entries(newErrors).length === 0) {
      if (!term) {
        toast.error("Please agree to the terms and conditions.");
      } else {
        try {
          const response = await createUser(Input.email, Input.password);

          if (response?.uid) {
            setUserId(response?.uid);
            setOpen(true);
            const displayName = Input.firstName + " " + Input.lastName;
            const countryName = countries.find((c) => c.code === Input.country);
            const createDate = createdDate();
            const country = countryName.emoji + " " + countryName.name;

            await signUpWithDetails(
              Input.firstName,
              Input.lastName,
              Input.email,
              displayName,
              Input.bdate,
              country,
              Input.language.name,
              Input.gender.name,
              createDate,
              response?.uid
            );
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-[30px]">
      <div className="shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] 2xl:max-w-[1200px] md:w-[80%] sm:w-[90%] w-full sm:mx-auto sm:p-[20px] p-[14px] relative h-[calc(100vh-99px)] overflow-auto mx-3">
        <button
          className="text-[#EF9595] text-[20px] absolute sm:left-[20px] left-[16px] sm:top-[35px] top-[24px]"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-[#EF9595] sm:text-[30px] text-[25px] font-bold text-center">
          Sign Up
        </h1>
        <div className="mt-[70px] lg:px-[30px] ">
          <div className="grid sm:grid-cols-2 items-center gap-[20px] md:flex-row flex-col">
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]"
                name="firstName"
                value={Input.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.firstName}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]"
                name="lastName"
                value={Input.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.lastName}
                </div>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Enter Email"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px] "
                name="email"
                value={Input.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.email}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="password (8 signs minimum)"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px]  focus:border-[#EF9595] border-[1px]"
                name="password"
                value={Input.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]"
                name="confirmPassword"
                value={Input.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            <div>
              <input
                type="date"
                placeholder="Date Of Birth"
                className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px]  focus:border-[#EF9595] border-[1px]"
                name="bdate"
                value={Input.bdate}
                onChange={handleChange}
              />
              {errors.bdate && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.bdate}
                </div>
              )}
            </div>
            <div className="w-full flag-select relative">
              <ReactFlagsSelect
                // name="country"
                // value={Input.bdate}
                selected={Input.country}
                onSelect={(e) => handleChange(e, "country")}
                searchable={true}
              />
              <span className="absolute right-[10px] top-[50%] translate-y-[-50%] flex items-center pr-2">
                <FaAngleDown className="text-[16px]" aria-hidden="true" />
              </span>
              {errors.country && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.country}
                </div>
              )}
            </div>
            <div className="w-full">
              <Listbox
                value={Input.language}
                onChange={(e) => handleChange(e, "language")}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px]  focus:border-[#EF9595] border-[1px] text-left">
                        <span className="block truncate">
                          {Input.language.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-[10px] flex items-center pr-2">
                          <FaAngleDown
                            className="text-[16px]"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {people.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-[#EF9595] text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-4 pr-4"
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate"
                                    )}
                                  >
                                    {person.name}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              {errors.language && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.language}
                </div>
              )}
            </div>
            <div>
              <Listbox
                value={Input.gender}
                onChange={(e) => handleChange(e, "gender")}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {Input.gender.name}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-[10px] flex items-center pr-2">
                          <FaAngleDown
                            className="text-[16px]"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {gender.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-[#EF9595] text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-4 pr-4"
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {person.name}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                      )}
                                    ></span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              {errors.gender && (
                <div className="text-[#e50000] text-[13px] block ml-5">
                  {errors.gender}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#323232] h-[1px] w-full mt-[30px]"></div>
          <div className="mt-[24px] flex items-center gap-[10px] p-[10px]">
            <label className="container">
              I have read and agree to{" "}
              <a href="#" className="text-blue-500 underline">
                {" "}
                The Terms and Condition
              </a>
              <input
                type="checkbox"
                name="radio"
                checked={term}
                onChange={() => setTerm(!term)}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <button
            className="bg-[#EF9595] text-[#fff] h-[48px] font-semibold w-[50%] block mx-auto mt-[36px] rounded-[30px] active:bg-[#2c7cf7]"
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>
      <CreateTweet
        open={open}
        setOpen={setOpen}
        showCloseBtn={false}
        userId={userId}
        isSignup={true}
      />
    </div>
  );
};

export default SignUp;
