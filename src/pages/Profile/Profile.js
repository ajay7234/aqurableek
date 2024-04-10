import React, { useEffect, useState, Fragment } from "react";
import { FaAngleDown, FaCamera, FaLink } from "react-icons/fa6";
import { Listbox, Menu, Transition } from "@headlessui/react";
import ReactFlagsSelect from "react-flags-select";
import BgImg from "../../assets/Images/bg-img.jpg";
import Avatar from "../../assets/Images/user.png";
import countries from "../../json/country.json";
import {
  createdDate,
  updateLikeList,
  updateUserData,
} from "../../helper/fetchTweetData";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import { IoMdShare } from "react-icons/io";
import { HiEye } from "react-icons/hi";
import { MdMessage, MdVerified } from "react-icons/md";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";
import SinglePost from "../../components/Modals/SinglePost";
import ReplyTweet from "../../components/Modals/ReplyTweet";
import NotFound from "../../assets/Images/not-found.png";
import ImageViewer from "../../components/Modals/ImageViewer";
import { formatTimeDifference } from "../../helper/formateTiming";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollectionData,
  updatePostLikeStatus,
} from "../../redux/userSlice";

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
  const [profile, setProfile] = useState();
  const [fileName, setFileName] = useState("");
  const [postData, setPostData] = useState([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({});
  const [post, setPost] = useState(false);
  const [singlePost, setSinglePost] = useState({});
  const [tweet, setTweet] = useState(false);
  const [postId, setPostId] = useState("");
  const [imageViewer, setImageViewer] = useState(false);
  const user = useSelector((state) => state.user.data);
  const userPostData = useSelector((state) => state.userPost);
  const dispatch = useDispatch();
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
    const userData = user.userData;
    const birthDate = userData.dob.split(" ")[0];
    const countryName = userData.country.split(" ")[1];
    const countryData = countries.find((c) => c.name === countryName);
    if (userData.profilePic) {
      setProfile(userData.profilePic);
    }
    setUserId(userData.userId);
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
    dispatch(fetchCollectionData());
    toast.success("profile details updated succesfully");
  };

  const handleCopySuccess = () => {
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchCollectionData());
    } else if (user) {
      getProfileData();
      setPostData(userPostData.userPosts);
      setUserData(userPostData.userProfile);
    }
  }, [user, dispatch, userPostData]);

  const handleFileChange = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setFileName(e.target.files[0]);
    setProfile(img);
  };

  const handleLike = async (postId) => {
    await updateLikeList(postId, userId);
    dispatch(updatePostLikeStatus({ postId, userId }));
  };

  return (
    <div>
      <div className="side-space">
        <div className="p-[20px]">
          <div className="flex justify-center items-center">
            <div className="2xl:max-w-[1300px] xl:w-[60%] w-full sm:mx-auto">
              <div className="shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] relative">
                <div className="relative">
                  <div className="absolute bottom-[10px] left-[10px] z-[1] border-[#fff] border-[5px] rounded-full">
                    <img
                      className="w-[100px] h-[100px] object-cover rounded-full"
                      src={profile || Avatar}
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
                    </div>
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
                        <FaAngleDown
                          className="text-[16px]"
                          aria-hidden="true"
                        />
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
              {postData?.length > 0 && (
                <div className="shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] bg-[#fff] rounded-[10px] mt-[20px]">
                  <div className="border-b-[#aaa] border-b-[1px] py-[14px] flex justify-center items-center">
                    <button className="bg-[#ef9595] text-[#fff] rounded-[6px] font-semibold p-[10px_23px]">
                      Posts
                    </button>
                  </div>
                  {postData?.map((item, i) => {
                    return (
                      <div
                        className="sm:p-[20px] p-[8px] border-b-[#c0bbbb] border-b-[1px] flex sm:flex-nowrap flex-wrap items-start"
                        key={i}
                      >
                        <div className="flex items-start sm:gap-[20px] gap-[12px] w-full">
                          <img
                            src={userData?.profilePic}
                            alt="user"
                            className="sm:w-[50px] sm:min-w-[50px] w-[30px] min-w-[30px] sm:h-[50px] h-[30px] rounded-full object-cover"
                          />
                          <div className="w-full">
                            <div className="flex items-center gap-1">
                              <h2 className="text-[18px] font-semibold">
                                {userData.displayName}
                              </h2>
                              {item?.user?.isVerified && (
                                <MdVerified className="text-[#ff6d51] text-[14px]" />
                              )}
                            </div>
                            <p className="text-[#5c5c5c] font-medium text-[14px]">
                              {userData.userName}
                            </p>

                            <p
                              className="text-[#5c5c5c] text-[16px] mt-[10px] break-all cursor-pointer"
                              onClick={() => {
                                setPost(true);
                                setSinglePost(item);
                              }}
                            >
                              {item?.description}
                            </p>
                            <div className="flex sm:justify-start justify-end">
                              {item?.imagePath &&
                              /\.(jpg|jpeg|png|svg)(?=\?alt=media)/i.test(
                                item?.imagePath
                              ) ? (
                                <div
                                  className="max-w-[300px] w-full h-[170px] rounded-[10px] mt-[12px]"
                                  onClick={() => {
                                    setImageViewer(!imageViewer);
                                    setSinglePost(item);
                                    setPost(false);
                                  }}
                                >
                                  <img
                                    className="w-full h-full object-cover rounded-[10px]"
                                    src={item?.imagePath}
                                    alt="postImage"
                                    onError={({ currentTarget }) => {
                                      currentTarget.src = NotFound;
                                      currentTarget.classList =
                                        "opacity-60 rounded-[10px]";
                                    }}
                                  />
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>

                            <div className="flex items-center gap-[24px] mt-[20px] flex-wrap">
                              <button
                                className={`flex sm:gap-[16px] gap-[6px] text-[16px] items-center `}
                                onClick={() => handleLike(item?.id)}
                              >
                                {item?.likeList?.includes(userId) ? (
                                  <TiArrowUpThick className="text-[24px] text-[green]" />
                                ) : (
                                  <TiArrowUpOutline className="text-[24px] text-[#5c5c5c]" />
                                )}
                                {item?.likeList?.length || 0}
                              </button>
                              <button
                                className="flex  sm:gap-[16px] gap-[6px] text-[16px] items-center"
                                // onClick={() => {
                                //   setTweet(true);
                                //   setPostId(item?.id);
                                // }}
                              >
                                <MdMessage className="text-[24px] text-[#5c5c5c]" />

                                {item?.commentCount || 0}
                              </button>

                              <button className="flex  sm:gap-[16px] gap-[6px] text-[16px] items-center">
                                <HiEye className="text-[24px] text-[#5c5c5c]" />
                                {item?.viewsList?.length * 3}
                              </button>
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div className="flex items-center">
                                  <Menu.Button className="text-[14px]">
                                    <IoMdShare className="sm:text-[24px] text-[20px] text-[#5c5c5c]" />
                                  </Menu.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <CopyToClipboard
                                            text="https://aqurableek-5rhg.vercel.app/dashboard"
                                            onCopy={handleCopySuccess}
                                          >
                                            <div
                                              className={classNames(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                "px-4 py-2 text-sm flex gap-2 cursor-pointer"
                                              )}
                                            >
                                              <FaLink className="text-[18px]" />
                                              Share Link
                                            </div>
                                          </CopyToClipboard>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          </div>
                        </div>
                        <p className="text-[12px] text-gray-500 whitespace-nowrap sm:mt-0 mt-2">
                          {formatTimeDifference(item?.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SinglePost
        post={post}
        setPost={setPost}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
      <ReplyTweet tweet={tweet} setTweet={setTweet} postId={postId} />
      <ImageViewer
        imageViewer={imageViewer}
        setImageViewer={setImageViewer}
        postData={singlePost}
        setPostData={setSinglePost}
        handleLike={handleLike}
      />
    </div>
  );
};

export default Profile;
