import {
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  set,
  startAt,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getCurrentUserData } from "./userProfileData";
import moment from "moment";

const database = getDatabase();

export const getTodayDate = (hours) => {
  const timeAgo = moment.utc().subtract(hours, "hours");
  const formattedDate = timeAgo.format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
  return formattedDate;
};

// export const bestPostByVoice = async (hours) => {
//   const todayDate = getTodayDate(hours);
//   const currentUser = await getCurrentUserData();
//   const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
//   const recentPostsQuery = query(
//     postsRef,
//     orderByChild("createdAt"),
//     startAt(todayDate)
//   );

//   let bestPost = null;
//   let highestScore = 0;
//   let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
//   await get(recentPostsQuery)
//     .then(async (snapshot) => {
//       if (snapshot.exists()) {
//         snapshot.forEach((childSnapshot) => {
//           const post = childSnapshot.val();
//           const postId = childSnapshot.key;

//           if (!selectedPostIds.includes(postId) && selectedPostIds.length >= 0) {
//             if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
//               const likeListLength = Array.isArray(post.likeList)
//                 ? post.likeList.length
//                 : 0;
//               const commentCount = post.commentCount || 0;
//               const views = Array.isArray(post.viewsList)
//                 ? post.viewsList.length
//                 : 0;
//               const score = likeListLength * 100 + commentCount * 10 + views;

//               const postTime = moment.utc(
//                 post.createdAt,
//                 "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
//               );
//               if (
//                 (post.Subject &&
//                   (post.Subject !== null || post.Subject !== "1") &&
//                   post.viewsList &&
//                   post.viewsList !== null &&
//                   post.viewsList.includes(currentUser.userId) &&
//                   (!post.reportList ||
//                     (!post.reportList.includes(currentUser.userId) &&
//                       post.reportList.length <= 6)) &&
//                   score > highestScore) ||
//                 (score === highestScore && postTime.isAfter(latestTime))
//               ) {
//                 highestScore = score;
//                 bestPost = { ...post, id: postId };
//                 selectedPostIds.push(bestPost.id);
//                 latestTime = postTime;
//               }
//             }
//           }
//         })
//         if (
//           bestPost &&
//           currentUser.userId &&
//           (!bestPost.viewsList ||
//             !bestPost.viewsList.includes(currentUser.userId))
//         ) {

//           const postRef = ref(
//             database,
//             `/tweetVoice/${currentUser.wordslang}/${bestPost.id}`
//           );
//           let updatedViewsList = bestPost.viewsList
//             ? [...bestPost.viewsList, currentUser.userId]
//             : [currentUser.userId];

//           await update(postRef, { viewsList: updatedViewsList })
//             .then(() => { })
//             .catch((error) =>
//               console.error("Failed to update post viewsList", error)
//             );
//         }


//       }

//     })
//     .catch((error) => {
//       console.error("Error fetching recent posts: ", error);
//     });

//   return bestPost;
// };

// export const bestPostByVoice = () => {
//   const selectedPostIds = [];
//   console.log("selectedPostIds======", selectedPostIds);
//   return async (hours) => {
//     const todayDate = getTodayDate(hours);
//     const currentUser = await getCurrentUserData();
//     const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
//     const recentPostsQuery = query(
//       postsRef,
//       orderByChild("createdAt"),
//       startAt(todayDate)
//     );

//     let bestPost = null;
//     let highestScore = 0;
//     let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";
//     await get(recentPostsQuery)
//       .then(async (snapshot) => {
//         if (snapshot.exists()) {
//           snapshot.forEach((childSnapshot) => {
//             const post = childSnapshot.val();
//             const postId = childSnapshot.key;

//             if (!selectedPostIds.includes(postId) && selectedPostIds.length >= 0) {
//               if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
//                 const likeListLength = Array.isArray(post.likeList)
//                   ? post.likeList.length
//                   : 0;
//                 const commentCount = post.commentCount || 0;
//                 const views = Array.isArray(post.viewsList)
//                   ? post.viewsList.length
//                   : 0;
//                 const score = likeListLength * 100 + commentCount * 10 + views;

//                 const postTime = moment.utc(
//                   post.createdAt,
//                   "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
//                 );
//                 if (
//                   (post.Subject &&
//                     (post.Subject !== null || post.Subject !== "1") &&
//                     post.viewsList &&
//                     post.viewsList !== null &&
//                     post.viewsList.includes(currentUser.userId) &&
//                     (!post.reportList ||
//                       (!post.reportList.includes(currentUser.userId) &&
//                         post.reportList.length <= 6)) &&
//                     score > highestScore) ||
//                   (score === highestScore && postTime.isAfter(latestTime))
//                 ) {
//                   highestScore = score;
//                   bestPost = { ...post, id: postId };
//                   selectedPostIds.push(bestPost.id);
//                   latestTime = postTime;
//                 }
//               }
//             }
//           })
//           if (
//             bestPost &&
//             currentUser.userId &&
//             (!bestPost.viewsList ||
//               !bestPost.viewsList.includes(currentUser.userId))
//           ) {

//             const postRef = ref(
//               database,
//               `/tweetVoice/${currentUser.wordslang}/${bestPost.id}`
//             );
//             let updatedViewsList = bestPost.viewsList
//               ? [...bestPost.viewsList, currentUser.userId]
//               : [currentUser.userId];

//             await update(postRef, { viewsList: updatedViewsList })
//               .then(() => { })
//               .catch((error) =>
//                 console.error("Failed to update post viewsList", error)
//               );
//           }


//         }

//       })
//       .catch((error) => {
//         console.error("Error fetching recent posts: ", error);
//       });

//     return bestPost;
//   }
// }

// export const bestPostByCountry = () => {
//   const selectedPostIds = []
//   return async (hours) => {
//     const todayDate = getTodayDate(hours);
//     const currentUser = await getCurrentUserData();
//     const postsRef = ref(database, `/tweetCountry/${currentUser.country}`);
//     const recentPostsQuery = query(
//       postsRef,
//       orderByChild("createdAt"),
//       startAt(todayDate)
//     );
//     let bestPost = null;
//     let highestScore = 0;
//     let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

//     await get(recentPostsQuery)
//       .then(async (snapshot) => {
//         if (snapshot.exists()) {
//           snapshot.forEach((childSnapshot) => {
//             const post = childSnapshot.val();

//             const postId = childSnapshot.key;
//             if (!selectedPostIds.includes(postId) && selectedPostIds.length >= 0) {
//               if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
//                 const likeListLength = Array.isArray(post.likeList)
//                   ? post.likeList.length
//                   : 0;
//                 const commentCount = post.commentCount || 0;
//                 const views = Array.isArray(post.viewsList)
//                   ? post.viewsList.length
//                   : 0;
//                 const score = likeListLength * 100 + commentCount * 10 + views;

//                 const postTime = moment.utc(
//                   post.createdAt,
//                   "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
//                 );

//                 if (
//                   (post.Subject &&
//                     post.Subject !== null &&
//                     post.Subject !== "1" &&
//                     post.viewsList !== null &&
//                     post.viewsList.includes(currentUser.userId) &&
//                     (!post.reportList ||
//                       (!post.reportList.includes(currentUser.userId) &&
//                         post.reportList.length <= 6)) &&
//                     score > highestScore) ||
//                   (score === highestScore && postTime.isAfter(latestTime))
//                 ) {
//                   highestScore = score;
//                   bestPost = { ...post, id: postId };
//                   selectedPostIds.push(bestPost.id);
//                   latestTime = postTime;
//                 }
//               }
//             }
//           });

//           if (
//             bestPost &&
//             currentUser.userId &&
//             (!bestPost.viewsList ||
//               !bestPost.viewsList.includes(currentUser.userId))
//           ) {
//             const postRef = ref(
//               database,
//               `/tweetCountry/${currentUser.country}/${bestPost.id}`
//             );
//             let updatedViewsList = bestPost.viewsList
//               ? [...bestPost.viewsList, currentUser.userId]
//               : [currentUser.userId];

//             await update(postRef, { viewsList: updatedViewsList })
//               .then(() => { })
//               .catch((error) =>
//                 console.error("Failed to update post viewsList", error)
//               );
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching recent posts: ", error);
//       });

//     return bestPost;
//   }
// }

// export const bestPostByCountry = async (hours) => {
//   const todayDate = getTodayDate(hours);
//   const currentUser = await getCurrentUserData();
//   const postsRef = ref(database, `/tweetCountry/${currentUser.country}`);
//   const recentPostsQuery = query(
//     postsRef,
//     orderByChild("createdAt"),
//     startAt(todayDate)
//   );
//   let bestPost = null;
//   let highestScore = 0;
//   let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

//   await get(recentPostsQuery)
//     .then(async (snapshot) => {
//       if (snapshot.exists()) {
//         snapshot.forEach((childSnapshot) => {
//           const post = childSnapshot.val();

//           const postId = childSnapshot.key;

//           if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
//             const likeListLength = Array.isArray(post.likeList)
//               ? post.likeList.length
//               : 0;
//             const commentCount = post.commentCount || 0;
//             const views = Array.isArray(post.viewsList)
//               ? post.viewsList.length
//               : 0;
//             const score = likeListLength * 100 + commentCount * 10 + views;

//             const postTime = moment.utc(
//               post.createdAt,
//               "YYYY-MM-DD HH:mm:ss.SSSSSSZ"
//             );

//             if (
//               (post.Subject &&
//                 post.Subject !== null &&
//                 post.Subject !== "1" &&
//                 post.viewsList !== null &&
//                 post.viewsList.includes(currentUser.userId) &&
//                 (!post.reportList ||
//                   (!post.reportList.includes(currentUser.userId) &&
//                     post.reportList.length <= 6)) &&
//                 score > highestScore) ||
//               (score === highestScore && postTime.isAfter(latestTime))
//             ) {
//               highestScore = score;
//               bestPost = { ...post, id: postId };
//               latestTime = postTime;
//             }
//           }
//         });

//         if (
//           bestPost &&
//           currentUser.userId &&
//           (!bestPost.viewsList ||
//             !bestPost.viewsList.includes(currentUser.userId))
//         ) {
//           const postRef = ref(
//             database,
//             `/tweetCountry/${currentUser.country}/${bestPost.id}`
//           );
//           let updatedViewsList = bestPost.viewsList
//             ? [...bestPost.viewsList, currentUser.userId]
//             : [currentUser.userId];

//           await update(postRef, { viewsList: updatedViewsList })
//             .then(() => { })
//             .catch((error) =>
//               console.error("Failed to update post viewsList", error)
//             );
//         }
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching recent posts: ", error);
//     });

//   return bestPost;
// };

const getBestPost = async (postsRef, currentUser, selectedPostIds, hours, collection) => {
  const todayDate = getTodayDate(hours);
  const recentPostsQuery = query(
    postsRef,
    orderByChild("createdAt"),
    startAt(todayDate)
  );

  let bestPost = null;
  let highestScore = 0;
  let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

  try {
    const snapshot = await get(recentPostsQuery);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        const postId = childSnapshot.key;

        if (!selectedPostIds.includes(postId)) {
          const postScore = calculateScore(post);
          const postTime = moment.utc(post.createdAt, "YYYY-MM-DD HH:mm:ss.SSSSSSZ");

          if (isBetterPost(post, postScore, postTime, currentUser, highestScore, latestTime)) {
            highestScore = postScore;
            bestPost = { ...post, id: postId };
            selectedPostIds.push(bestPost.id);
            latestTime = postTime;
          }
        }
      });

      await updateViewsList(bestPost, currentUser, collection);
    }
  } catch (error) {
    console.error("Error fetching recent posts: ", error);
  }

  return bestPost;
};

const calculateScore = (post) => {
  const likeListLength = Array.isArray(post.likeList) ? post.likeList.length : 0;
  const commentCount = post.commentCount || 0;
  const views = Array.isArray(post.viewsList) ? post.viewsList.length : 0;
  return likeListLength * 100 + commentCount * 10 + views;
};

const isBetterPost = (post, postScore, postTime, currentUser, highestScore, latestTime) => {
  return (
    post.Subject &&
    post.Subject !== null &&
    post.Subject !== "1" &&
    post.viewsList !== null &&
    post.viewsList.includes(currentUser.userId) &&
    (!post.parentkey || (post.parentkey && post.childkey)) &&
    (!post.reportList || (!post.reportList.includes(currentUser.userId) && post.reportList.length <= 6)) &&
    (postScore > highestScore || (postScore === highestScore && postTime.isAfter(latestTime)))
  );
};

const updateViewsList = async (bestPost, currentUser, language, collection) => {
  if (bestPost && currentUser.userId && (!bestPost.viewsList || !bestPost.viewsList.includes(currentUser.userId))) {
    let postRef
    if (collection === "tweetVoice") {
      postRef = ref(database, `tweetVoice/${language}/${bestPost.id}`);
    } else {
      postRef = ref(database, `tweetCountry/${currentUser.country}/${bestPost.id}`);
    }
    const updatedViewsList = bestPost.viewsList ? [...bestPost.viewsList, currentUser.userId] : [currentUser.userId];
    await update(postRef, { viewsList: updatedViewsList });
  }
};

const bestPostRefPath = (currentUser, postId) => {
  if (currentUser.hasOwnProperty('wordslang')) {
    return `/tweetVoice/${currentUser.wordslang}/${postId}`;
  } else if (currentUser.hasOwnProperty('country')) {
    return `/tweetCountry/${currentUser.country}/${postId}`;
  }
};

// const getBestPostByLang = async (language, hours) => {
//   const currentUser = await getCurrentUserData();
//   if (!currentUser || currentUser.wordslang !== "Arabic worlds") {
//     return null;
//   }
//   const collection = "tweetVoice"
//   const hoursAgo = getTodayDate(hours);
//   const postsRef = ref(database, `/tweetVoice/${language}`);
//   const recentPostsQuery = query(
//     postsRef,
//     orderByChild("createdAt"),
//     startAt(hoursAgo)
//   );

//   let bestPost = null;
//   let highestScore = 0;
//   let latestTime = moment().format("YYYY-MM-DD HH:mm:ss.SSSSSS") + "Z";

//   try {
//     const snapshot = await get(recentPostsQuery);
//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const post = childSnapshot.val();
//         const postId = childSnapshot.key;

//         if (!post.parentkey || (post.parentKey && post.childkey !== null)) {
//           const postScore = calculateScore(post);
//           const postTime = moment(post.createdAt, "YYYY-MM-DD HH:mm:ss.SSSSSSZ");

//           if (isBetterPost(post, postScore, postTime, currentUser, highestScore, latestTime)) {
//             highestScore = postScore;
//             bestPost = { ...post, id: postId };
//             latestTime = postTime;
//           }
//         }
//       });

//       await updateViewsList(bestPost, currentUser, language, collection);
//     }
//   } catch (error) {
//     console.error("Error fetching recent posts: ", error);
//   }

//   return bestPost;
// };

export const latestPostByVoice = async (order) => {
  let response = [];
  const currentUser = await getCurrentUserData();
  const database = getDatabase();
  const postsRef = ref(database, `tweetVoice/${currentUser.wordslang}`);
  const recentPostsQuery = query(postsRef, orderByChild("createdAt"));

  await get(recentPostsQuery)
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const posts = [];
        const updates = {};

        snapshot.forEach((childSnapshot) => {
          let postData = { ...childSnapshot.val(), id: childSnapshot.key };

          if (!postData.viewsList) {
            postData.viewsList = [];
          }

          if (!postData?.viewsList?.includes(currentUser.userId)) {
            postData?.viewsList?.push(currentUser.userId);
            updates[
              `/tweetVoice/${currentUser.wordslang}/${postData.id}/viewsList`
            ] = postData.viewsList;
          }

          posts.push(postData);
        });

        if (Object.keys(updates).length > 0) {
          await update(ref(database), updates);
        }

        const filteredPosts = posts.filter((post) => {
          const hasValidSubject =
            post.Subject && post.Subject !== null && post.Subject !== "1";
          const hasValidParentChildKeys =
            !post.parentkey || (post.parentkey && post.childkey);
          const excludeBasedOnReportList =
            !post.reportList ||
            (!post.reportList.includes(currentUser.userId) &&
              post.reportList?.length <= 6);
          const hasViewList =
            post.viewsList &&
            post.viewsList !== null &&
            post.viewsList.includes(currentUser.userId);

          return (
            hasValidSubject &&
            hasValidParentChildKeys &&
            excludeBasedOnReportList &&
            hasViewList
          );
        });

        const orderedPosts = filteredPosts.reverse();
        response = orderedPosts || null;
      }
    })
    .catch((error) => {
      console.error("Failed to fetch or update post data", error);
      throw error;
    });

  return response;
};

export const bestPostByVoice = () => {
  const selectedPostIds = [];
  const collection = "tweetVoice"
  return async (hours) => {
    const currentUser = await getCurrentUserData();
    const postsRef = ref(database, bestPostRefPath(currentUser, ""));
    return await getBestPost(postsRef, currentUser, selectedPostIds, hours, collection);
  };
};

export const bestPostByCountry = () => {
  const selectedPostIds = [];
  const collection = "tweetCountry"
  return async (hours) => {
    const currentUser = await getCurrentUserData();
    const postsRef = ref(database, bestPostRefPath(currentUser, ""));
    return await getBestPost(postsRef, currentUser, selectedPostIds, hours, collection);
  };
};

// export const bestPostByEngLang = async (hours) => {
//   return await getBestPostByLang("English worlds", hours);
// };

export const bestPostByEngLang = async (hours) => {
  const hoursAgo = getTodayDate(hours);
  const currentUser = await getCurrentUserData();
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
    .then(async (snapshot) => {
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
              (score === highestScore &&
                postTime.isAfter(latestTime) &&
                (!post.reportList ||
                  (!post.reportList.includes(currentUser.userId) &&
                    post.reportList.length <= 6))
              )
            ) {
              highestScore = score;
              bestPost = { ...post, id: postId };
              latestTime = postTime;
            }
          }
        });

        if (
          bestPost &&
          currentUser.userId &&
          (!bestPost.viewsList ||
            !bestPost.viewsList.includes(currentUser.userId))
        ) {
          const postRef = ref(
            database,
            `/tweetVoice/${englishWorld}/${bestPost.id}`
          );
          let updatedViewsList = bestPost.viewsList
            ? [...bestPost.viewsList, currentUser.userId]
            : [currentUser.userId];

          await update(postRef, { viewsList: updatedViewsList })
            .then(() => { })
            .catch((error) =>
              console.error("Failed to update post viewsList", error)
            );
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching recent posts: ", error);
    });
  return bestPost;
};

export const restPostByVoice = async () => {
  try {
    const currentUser = await getCurrentUserData();
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
      .filter((post) => {
        const basicChecks =
          post.Subject &&
          post.Subject !== "1" &&
          post.viewsList &&
          post.viewsList !== null &&
          !post.parentkey;

        const childPostCheck =
          post.parentKey &&
          post.childkey !== null &&
          post.viewsList.includes(currentUser.userId);

        const excludeBasedOnReportList =
          !post.reportList ||
          (!post.reportList.includes(currentUser.userId) &&
            post.reportList?.length <= 6);

        return (basicChecks || childPostCheck) && excludeBasedOnReportList;
      })
      .reverse();

    for (let post of response) {
      if (!post.viewsList) {
        post.viewsList = [];
      }
      if (!post.viewsList.includes(currentUser.userId)) {
        post.viewsList.push(currentUser.userId);

        const postRef = ref(
          database,
          `tweetVoice/${currentUser.wordslang}/${post.id}`
        );
        await update(postRef, { viewsList: post.viewsList })
          .then(() => { })
          .catch((error) =>
            console.error("Failed to update post viewsList", error)
          );
      }
    }

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
          // age: userData.age,
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