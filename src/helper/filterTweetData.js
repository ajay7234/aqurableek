import {
  get,
  getDatabase,
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
  const timeAgo = moment.utc().subtract(hours, "hours");
  const formattedDate = timeAgo.format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
  return formattedDate;
};

export const latestPostByVoice = async (order) => {
  let response;
  const currentUser = await getUserData();
  const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
  const recentPostsQuery = query(postsRef, orderByChild("createdAt"));

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach((childSnapshot) => {
          const postData = { ...childSnapshot.val(), id: childSnapshot.key };
          posts.push(postData);
        });
        const filteredPosts = posts.filter((post) => {
          const hasValidSubject =
            post.Subject && post.Subject !== null && post.Subject !== "1";

          const hasValidParentChildKeys =
            !post.parentkey || (post.parentkey && post.childkey);

          // const hasViewList = post.viewsList && post.viewsList !== null;

          return hasValidSubject && hasValidParentChildKeys;
        });

        const orderedPosts = filteredPosts.reverse();
        response = orderedPosts[order] || null;
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
  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          const postId = childSnapshot.key;

          if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
            const likeListLength = Array.isArray(post.likeList)
              ? post.likeList.length
              : 0;
            const commentCount = post.commentCount || 0;
            const views = Array.isArray(post.viewsList)
              ? post.viewsList.length
              : 0;
            const score = likeListLength * 100 + commentCount * 10 + views;

            const postTime = moment.utc(
              post.createdAt,
              "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
            );
            if (
              post.Subject &&
              (post.Subject !== null || post.Subject !== "1") &&
              post.viewsList &&
              post.viewsList !== null &&
              post.viewsList.includes(currentUser.userId) &&
              (!post.reportList ||
                !post.reportList.includes(currentUser.userId) ||
                post.reportList.length <= 6) &&
              (score > highestScore ||
                (score === highestScore && postTime.isAfter(latestTime)))
            ) {
              highestScore = score;
              bestPost = { ...post, id: postId };
              latestTime = postTime;
            }
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
  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();

          const postId = childSnapshot.key;

          if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
            const likeListLength = Array.isArray(post.likeList)
              ? post.likeList.length
              : 0;
            const commentCount = post.commentCount || 0;
            const views = Array.isArray(post.viewsList)
              ? post.viewsList.length
              : 0;
            const score = likeListLength * 100 + commentCount * 10 + views;

            const postTime = moment.utc(
              post.createdAt,
              "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
            );

            if (
              (post.Subject &&
                post.Subject !== null &&
                post.Subject !== "1" &&
                post.viewsList !== null &&
                post.viewsList.includes(currentUser.userId) &&
                (!post.reportList ||
                  !post.reportList.includes(currentUser.userId) ||
                  post.reportList.length <= 6) &&
                score > highestScore) ||
              (score === highestScore && postTime.isAfter(latestTime))
            ) {
              highestScore = score;
              bestPost = { ...post, id: postId };
              latestTime = postTime;
            }
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

  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

  await get(recentPostsQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          const postId = childSnapshot.key;

          if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
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
  try {
    const currentUser = await getUserData();
    if (!currentUser || !currentUser.wordslang) {
      throw new Error("No current user or user wordslang found.");
    }

    const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
    const recentPostsQuery = query(postsRef, orderByChild("createdAt"));

    const snapshot = await get(recentPostsQuery);
    if (!snapshot.exists()) {
      return [];
    }

    const posts = snapshot.val();
    const response = Object.entries(posts)
      .map(([id, post]) => ({ id, ...post }))
      .filter(
        (post) =>
          (post.createdAt !== undefined &&
            post.Subject &&
            post.Subject !== "1" &&
            post.viewsList &&
            post.viewsList !== null &&
            !post.parentkey) ||
          (post.parentKey &&
            post.childkey !== null &&
            post.viewsList.includes(currentUser.userId) &&
            (!post.reportList ||
              !post.reportList.includes(currentUser.userId) ||
              post.reportList.length <= 6))
      )
      .reverse();

    return response;
  } catch (error) {
    console.error("Failed to fetch user data", error);
  }
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
        user: {
          displayName: userData.displayName,
          isOnline: false,
          isVerified: false,
          userName: userData.userName || "",
          userId: userId,
          age: userData.age,
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
