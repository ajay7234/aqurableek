import { get, getDatabase, push, ref, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import moment from "moment";

const database = getDatabase();

export const getTodayDate = (hours) => {
  const timeAgo = moment.utc().subtract(hours, "hours");
  const formattedDate = timeAgo.format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
  return formattedDate;
};

export const uploadImageToStorage = async (imageFile) => {
  const storage = getStorage();
  const uniqueFileName = `${Date.now()}-${imageFile.name}`;
  const storageReference = storageRef(storage, `tweetImage/${uniqueFileName}`);
  await uploadBytes(storageReference, imageFile);
  const downloadURL = await getDownloadURL(storageReference);
  return downloadURL;
};

export const uploadPostData = async (inputValue, userId, fileName) => {
  const currentDateTime = getTodayDate(0);
  try {
    let image;
    if (fileName !== "") {
      image = await uploadImageToStorage(fileName).catch(console.error);
    }
    let userData;
    await get(ref(database, "/profile/" + userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          userData = snapshot.val();
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data", error);
      });

    if (userData) {
      const updateObject = {
        description: inputValue,
        userId: userId,
        createdAt: currentDateTime,
        likeCount: 0,
        commentCount: 0,
        retweetCount: 0,
        Subject: "0",
        parentkey: null,
        childKey: null,
        lanCode: userData.wordslang === "Arabic worlds" ? "ar" : "auto",
        //viewsList: [],
        user: {
          displayName: userData.displayName,
          isOnline: false,
          isVerified: false,
          userName: userData.userName || "",
          userId: userId,
          age: userData.age || "",
        },
      };

      if (fileName !== "") {
        updateObject.imagePath = image;
      }
      if (userData.profilePic) {
        updateObject.user.profilePic = userData.profilePic;
      }

      const newPostRef = push(
        ref(database, `tweetVoice/${userData.wordslang}`)
      );
      await set(newPostRef, updateObject);
    }
  } catch (error) {
    console.error("Failed to upload post: ", error);
  }
};
