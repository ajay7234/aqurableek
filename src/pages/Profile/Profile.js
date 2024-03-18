import React, { useEffect, useState, Fragment } from "react";
import { FaAngleDown, FaCamera } from "react-icons/fa6";
import { Listbox, Transition } from "@headlessui/react";
import ReactFlagsSelect from "react-flags-select";
import BgImg from "../../assets/Images/bg-img.jpg";
import user from "../../assets/Images/user.png";
import countries from "../../json/country.json";
import Sidebar from "../../components/Sidebar/Sidebar";
import { createdDate, updateUserData } from "../../helper/fetchTweetData";
import { getUserData } from "../../helper/userProfileData";
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
const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState();
  const [fileName, setFileName] = useState("");
  const [Input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    dob: "",
    country: "",
    language: "",
    gender: "",
    documentName: "",
    age: "",
    isStudent: "",
    isJob: "",
  });

  const handleChange = (e, fieldName = "") => {
    if (fieldName) {
      if (
        fieldName === "language" ||
        fieldName === "gender" ||
        fieldName === "job" ||
        fieldName === "school"
      ) {
        setInput((prevVal) => ({
          ...prevVal,
          [fieldName]: e.name,
        }));
      } else {
        setInput((prevVal) => ({
          ...prevVal,
          [fieldName]: e,
        }));
      }
    } else {
      const { name, value } = e.target;
      setInput((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  };

  const getProfileData = async () => {
    const userData = await getUserData();
    const birthDate = userData.dob.split(" ")[0];
    const countryName = userData.country.split(" ")[1];
    const countryData = countries.find((c) => c.name === countryName);
    if (userData.profilePic) {
      setProfile(userData.profilePic);
    }
    setInput({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      language: userData.wordslang,
      dob: birthDate,
      country: countryData.code,
      bio: userData.bio,
      age: userData.age,
    });
  };

  const handleSubmit = async () => {
    const displayName = Input.firstName + " " + Input.lastName;
    const countryName = countries.find((c) => c.code === Input.country);
    const updatedAt = createdDate();
    const country = countryName.emoji + " " + countryName.name;

    const userData = {
      firstName: Input.firstName,
      lastName: Input.lastName,
      email: Input.email,
      displayName,
      dob: Input.dob,
      country,
      wordslang: Input.language,
      gender: Input.gender,
      age: Input.age,
      bio: Input.bio,
      updatedAt,
    };

    const imageUrl = fileName !== "" && fileName;
    if (imageUrl) {
      userData.image = imageUrl;
    }

    await updateUserData(userData);
    toast.success("profile details updated succesfully");
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const handleFileChange = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setFileName(e.target.files[0]);
    setProfile(img);
  };

  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={!sidebarOpen ? "lg:pl-72" : ""}>
        <div className="p-[20px]">
          <div className="flex justify-center items-center mt-[30px]">
            <div className="shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] 2xl:max-w-[1300px] xl:w-[60%] w-full sm:mx-auto relative">
              <div className="relative">
                <div className="absolute bottom-[10px] left-[10px] z-[1] border-[#fff] border-[5px] rounded-full">
                  <img
                    className="w-[100px] h-[100px] object-cover rounded-full"
                    src={profile || user}
                    alt="Your Company"
                  />
                  <div className="bg-[#0000005f] absolute top-0 left-0 w-full h-full rounded-full"></div>
                  <button className="flex justify-center items-center absolute top-[50%] left-[50%] text-[20px] translate-x-[-50%] translate-y-[-50%]">
                    <FaCamera className="text-white" />
                  </button>
                  <input
                    type="file"
                    className="opacity-0 w-full h-full absolute top-0"
                    onChange={(e) => handleFileChange(e)}
                  />
                </div>
                <div className="relative">
                  <div>
                    <img
                      src={BgImg}
                      alt="BgImg"
                      className="sm:h-[350px] h-[280px] relative object-cover w-full"
                    />
                    <div className="bg-[#0000005f] absolute top-0 left-0 w-full h-full"></div>
                    {/* <button className="bg-[#0000008f] w-[40px] h-[40px] rounded-full flex justify-center items-center absolute top-[50%] left-[50%] text-[20px]">
                      <FaCamera className="text-white" />
                    </button> */}
                  </div>
                  {/* <input
                    type="file"
                    className="opacity-0 w-full h-full absolute top-0"
                  /> */}
                </div>
              </div>
              <div className="mt-[40px] px-[20px]">
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
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter Bio"
                      className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]"
                      name="bio"
                      value={Input.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      placeholder="Date Of Birth"
                      className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px]  focus:border-[#EF9595] border-[1px]"
                      name="dob"
                      value={Input.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flag-select relative">
                    <ReactFlagsSelect
                      selected={Input.country}
                      onSelect={(e) => handleChange(e, "country")}
                      searchable={true}
                    />
                    <span className="absolute right-[10px] top-[50%] translate-y-[-50%] flex items-center pr-2">
                      <FaAngleDown className="text-[16px]" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="w-full">
                    <Listbox
                      value={Input.language}
                      onChange={(e) => {
                        handleChange(e, "language");
                      }}
                    >
                      {({ open }) => (
                        <>
                          <div className="relative">
                            <Listbox.Button className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px]  focus:border-[#EF9595] border-[1px] text-left">
                              <span className="block truncate">
                                {Input.language || people[0].name}
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
                                  {Input.gender || gender[0].name}
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
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Age as per document"
                      name="age"
                      value={Input.age}
                      onChange={handleChange}
                      className="bg-[#f1f1f1] text-black outline-none rounded-[30px] h-[48px] w-full placeholder:text-[#323232] p-[10px_16px] focus:border-[#EF9595] border-[1px]"
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-4 pb-[20px] mt-[50px]">
                  <button
                    className="bg-[#EF9595] text-[#fff] h-[48px] font-semibold w-[100px] block rounded-[10px]"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
