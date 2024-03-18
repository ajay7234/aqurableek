import {
  get,
  getDatabase,
  limitToLast,
  orderByChild,
  push,
  query,
  ref,
  set,
  startAt,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getUserData } from "./userProfileData";
import moment from "moment";

const database = getDatabase();

export const getTodayDate = (hours) => {
  const timeAgo = moment().subtract(hours, "hours");
  const formattedDate = timeAgo.format("YYYY-MM-DD HH:mm:ss") + ".000000Z";
  return formattedDate;
};

export const latestPostByVoice = async (order) => {
  let response;
  const currentUser = await getUserData();
  const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
  const recentPostsQuery = query(
    postsRef,
    orderByChild("createdAt"),
    limitToLast(order)
  );

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
          const postData = { ...childSnapshot.val(), id: childSnapshot.key };
          posts.push(postData);
        });

        const orderedPosts = posts.reverse();
        response = orderedPosts[order - 1] || null;
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
      throw error;
    });

  return response;
};

export const bestPostByVoice = async (hours) => {
  const todayDate = getTodayDate(hours);
  const currentUser = await getUserData();
  const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
  const recentPostsQuery = query(
    postsRef,
    orderByChild("createdAt"),
    startAt(todayDate)
  );

  let bestPost = null;
  let highestScore = 0;
  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss") + ".000000Z";

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          const postId = childSnapshot.key;
          const likeListLength = Array.isArray(post.likeList)
            ? post.likeList.length
            : 0;
          const commentCount = post.commentCount || 0;
          const views = Array.isArray(post.viewsList)
            ? post.viewsList.length
            : 0;
          const score = likeListLength * 100 + commentCount * 10 + views;

          const postTime = moment(
            post.createdAt,
            "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
          );

          if (
            score > highestScore ||
            (score === highestScore && postTime.isAfter(latestTime))
          ) {
            highestScore = score;
            bestPost = { ...post, id: postId };
            latestTime = postTime;
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching recent posts: ", error);
    });

  return bestPost;
};

export const bestPostByCountry = async (hours) => {
  const todayDate = getTodayDate(hours);
  const currentUser = await getUserData();
  const postsRef = ref(database, `/tweetCountry/${currentUser.country}`);
  const recentPostsQuery = query(
    postsRef,
    orderByChild("createdAt"),
    startAt(todayDate)
  );
  let bestPost = null;
  let highestScore = 0;
  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss") + ".000000Z";

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          const postId = childSnapshot.key;
          const likeListLength = Array.isArray(post.likeList)
            ? post.likeList.length
            : 0;
          const commentCount = post.commentCount || 0;
          const views = Array.isArray(post.viewsList)
            ? post.viewsList.length
            : 0;
          const score = likeListLength * 100 + commentCount * 10 + views;

          const postTime = moment(
            post.createdAt,
            "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
          );

          if (
            score > highestScore ||
            (score === highestScore && postTime.isAfter(latestTime))
          ) {
            highestScore = score;
            bestPost = { ...post, id: postId };
            latestTime = postTime;
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching recent posts: ", error);
    });

  return bestPost;
};

export const bestPostByEngLang = async (hours) => {
  const hoursAgo = getTodayDate(hours);
  const currentUser = await getUserData();
  let desireLanguage = "Arabic worlds";
  if (currentUser.wordslang !== desireLanguage) {
    return null;
  }

  const englishWorld = "English worlds";
  const postsRef = ref(database, `/tweetVoice/${englishWorld}`);
  const recentPostsQuery = query(
    postsRef,
    orderByChild("createdAt"),
    startAt(hoursAgo)
  );

  let bestPost = null;
  let highestScore = 0;

  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss") + ".000000Z";

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          const postId = childSnapshot.key;
          const likeListLength = Array.isArray(post.likeList)
            ? post.likeList.length
            : 0;
          const commentCount = post.commentCount || 0;
          const views = Array.isArray(post.viewsList)
            ? post.viewsList.length
            : 0;
          const score = likeListLength * 100 + commentCount * 100 + views;

          const postTime = moment(
            post.createdAt,
            "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
          );

          if (
            score > highestScore ||
            (score === highestScore && postTime.isAfter(latestTime))
          ) {
            highestScore = score;
            bestPost = { ...post, id: postId };
            latestTime = postTime;
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching recent posts: ", error);
    });

  return bestPost;
};

export const restPostByVoice = async () => {
  let response;
  const currentUser = await getUserData();
  const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
  const recentPostsQuery = query(postsRef, orderByChild("createdAt"));
  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const posts = snapshot.val();
        const sortedPosts = Object.keys(posts)
          .map((key) => ({ id: key, ...posts[key] }))
          .filter((post) => post.createdAt !== undefined)
          .reverse();
        response = sortedPosts;
      }
    })
    .catch((error) => {
      console.error("Failed to fetch user data", error);
      throw error;
    });

  return response;
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
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
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
        lanCode: "",
        user: {
          displayName: userData.displayName,
          isOnline: false,
          isVerified: false,
          // profilePic: userData.profilePic,
          userName: userData.userName || "",
          userId: userId,
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
