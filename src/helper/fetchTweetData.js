import {
  get,
  getDatabase,
  ref,
  runTransaction,
  update,
} from "firebase/database";
import "firebase/database";
import { uploadImageToStorage } from "./filterTweetData";
import { getUserData } from "./userProfileData";
import moment from "moment";

const database = getDatabase();

export const updateLikeList = async (postId) => {
  const userData = await getUserData();

  const postRef = ref(database, `tweetVoice/${userData.wordslang}/${postId}`);
  await get(postRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        updatePostLikeList(postRef, userData);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
    });

  const endlishRef = ref(database, `tweetVoice/English worlds/${postId}`);
  await get(endlishRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        updatePostLikeList(endlishRef, userData);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
    });

  const countryRef = ref(database, `tweetVoice/${userData.country}/${postId}`);
  await get(countryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        updatePostLikeList(countryRef, userData);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
    });
};

const updatePostLikeList = (postRef, userData) => {
  runTransaction(postRef, (post) => {
    if (post) {
      if (!post.likeList) {
        post.likeList = [];
      }

      const index = post.likeList.indexOf(userData.userId);
      if (index === -1) {
        post.likeCount = (post.likeCount || 0) + 1;
        post.likeList.push(userData.userId);
      } else {
        post.likeCount -= 1;
        post.likeList.splice(index, 1);
      }
    }
    return post;
  })
    .then((result) => {})
    .catch((error) => {
      console.error("Like status update failed: ", error);
    });
};

export const updateUserData = async (userDetails) => {
  const {
    firstName,
    lastName,
    email,
    displayName,
    dob,
    country,
    wordslang,
    gender,
    age,
    bio,
    updatedAt,
    image,
  } = userDetails;

  const userData = await getUserData();
  let imageUrl;

  if (image) {
    imageUrl = await uploadImageToStorage(image).catch(console.error);
  }

  const updateObject = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    displayName: displayName,
    dob: dob,
    country: country,
    wordslang: wordslang,
    gender: gender,
    age: age,
    bio: bio,
    updatedAt: updatedAt,
    userId: userData.userId,
  };
  if (imageUrl) {
    updateObject.profilePic = imageUrl;
  }
  try {
    const userRef = ref(database, "/profile/" + userData.userId);
    await update(userRef, updateObject);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createdDate = () => {
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

  return currentDateTime;
};

export const singlePostData = async (postId) => {
  const userData = await getUserData();
  if (!userData) {
    return null;
  }

  let response = null;

  const refsToTry = [
    `/tweetVoice/${userData.wordslang}/${postId}`,
    `/tweetVoice/English worlds/${postId}`,
    `/tweetCountry/${userData.country}/${postId}`,
  ];

  for (let path of refsToTry) {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef).catch(console.log);
    if (snapshot?.exists()) {
      const data = snapshot.val();
      if (data.user) {
        response = data;
        break;
      }
    }
  }

  return response;
};

export const replyCommentData = async (
  postId,
  inputValue,
  createdAt,
  fileName
) => {
  try {
    const userData = await getUserData();

    await tryUpdatePost(
      `tweetVoice/${userData.wordslang}/${postId}`,
      inputValue,
      createdAt,
      userData.userId,
      fileName
    );

    await tryUpdatePost(
      `tweetVoice/English worlds/${postId}`,
      inputValue,
      createdAt,
      userData.userId,
      fileName
    );

    await tryUpdatePost(
      `tweetVoice/${userData.country}/${postId}`,
      inputValue,
      createdAt,
      userData.userId,
      fileName
    );
  } catch (error) {
    console.error("Failed to reply to comment", error);
    throw error;
  }
};

const tryUpdatePost = async (path, inputValue, createdAt, userId, fileName) => {
  const postRef = ref(database, path);
  const snapshot = await get(postRef);
  if (snapshot.exists()) {
    let postData = snapshot.val();
    postData.commentCount = (postData.commentCount || 0) + 1;

    if (!Array.isArray(postData.commentList)) {
      postData.commentList = [];
    }

    let commentData = {
      comment: inputValue,
      userId: userId,
      createdAt: createdAt,
    };
    if (fileName !== "") {
      try {
        const imageUrl = await uploadImageToStorage(fileName);
        commentData.imageUrl = imageUrl;
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }

    postData.commentList.push(commentData);

    await update(postRef, postData);
  }
  return true;
};

export const voiceData = async () => {
  const userData = await getUserData();
  let response;
  const postRef = ref(database, `tweetVoice/${userData.wordslang}`);
  await get(postRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        response = snapshot.val();
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
    });
  return response;
};
