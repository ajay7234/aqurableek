import { getDatabase, ref, update } from "firebase/database";
import moment from "moment";

const database = getDatabase();

export const latestTweetVoiceData = async (tweetVoiceData, currentUser) => {
  if (!tweetVoiceData || !currentUser) return [];

  let posts = Object.entries(tweetVoiceData)
    .reduce((acc, [key, value]) => {
      const postData = { ...value, id: key };

      const hasValidSubject = postData.Subject && postData.Subject !== "1";
      const hasValidParentChildKeys =
        !postData.parentkey || (postData.parentkey && postData.childkey);
      const excludeBasedOnReportList =
        !postData.reportList ||
        (!postData.reportList.includes(currentUser.userId) &&
          postData.reportList.length <= 6);
      const hasViewList =
        postData.viewsList && Array.isArray(postData.viewsList);

      if (
        hasValidSubject &&
        hasValidParentChildKeys &&
        excludeBasedOnReportList
      ) {
        let updatedPostData = { ...postData };
        if (!hasViewList) {
          updatedPostData.viewsList = [currentUser.userId];
        } else if (!postData.viewsList.includes(currentUser.userId)) {
          updatedPostData.viewsList = [
            ...postData.viewsList,
            currentUser.userId,
          ];
        }
        acc.push(updatedPostData);
      }

      return acc;
    }, [])
    .reverse();

  const limit = Math.min(posts.length, 7);
  for (let i = 0; i < limit; i++) {
    let post = posts[i];
    if (!post.viewsList) {
      post.viewsList = [];
    }
    if (!post.viewsList.includes(currentUser.userId)) {
      post.viewsList.push(currentUser.userId);
    }
    if (post.viewsList) {
      const postRef = ref(
        database,
        `tweetVoice/${currentUser.wordslang}/${post.id}`
      );
      await update(postRef, { viewsList: post.viewsList })
        .then(() =>
          console.log("ViewsList updated for post", post.id, "i----", i)
        )
        .catch((error) =>
          console.error("Failed to update post viewsList", error)
        );
    }
  }
  return posts;
};

export const filterTweetVoiceData = async (
  tweetVoiceData,
  currentUser,
  hours
) => {
  if (!tweetVoiceData || !currentUser || !hours) return null;

  const cutoffTime = moment().subtract(hours, "hours");
  let bestPost = null;
  let highestScore = -1;

  Object.entries(tweetVoiceData).forEach(([postId, post]) => {
    const postCreationTime = moment(post.createdAt);

    if (postCreationTime.isAfter(cutoffTime)) {
      const score = calculateScore(post);

      if (score > highestScore) {
        if (isBetterPost(post, currentUser)) {
          highestScore = score;
          bestPost = { id: postId, ...post };
        }
      } else if (
        score === highestScore &&
        postCreationTime.isAfter(moment(bestPost.createdAt))
      ) {
        bestPost = { id: postId, ...post };
      }
    }
  });

  let language = currentUser.wordslang;
  let collection = "tweetVoice";
  if (bestPost) {
    await updateViewsList(bestPost, currentUser, language, collection);
    return bestPost;
  } else {
    return null;
  }
};

export const filterTweetCountryData = async (
  tweetCountryData,
  currentUser,
  hours
) => {
  if (!tweetCountryData || !currentUser || !hours) return null;
  const cutoffTime = moment().subtract(hours, "hours");
  let bestPost = null;
  let highestScore = -1;

  if (Object.values(tweetCountryData).length !== 0) {
    Object.entries(tweetCountryData).forEach(([postId, post]) => {
      const postCreationTime = moment(post.createdAt);

      if (postCreationTime.isAfter(cutoffTime)) {
        const score = calculateScore(post);

        if (score > highestScore) {
          if (isBetterPost(post, currentUser)) {
            highestScore = score;
            bestPost = { id: postId, ...post, score: score };
          }
        } else if (
          score === highestScore &&
          postCreationTime.isAfter(moment(bestPost.createdAt))
        ) {
          bestPost = { id: postId, ...post, score: score };
        }
      }
    });

    let language = currentUser.country;
    let collection = "tweetCountry";
    if (bestPost) {
      await updateViewsList(bestPost, currentUser, language, collection);
      return bestPost;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const filterEnglishPostData = async (
  englishPostData,
  currentUser,
  hours
) => {
  if (!englishPostData || !currentUser || !hours) return null;

  if (currentUser.wordslang === "Arabic worlds") {
    const cutoffTime = moment().subtract(hours, "hours");
    let bestPost = null;
    let highestScore = -1;

    if (Object.values(englishPostData).length !== 0) {
      Object.values(englishPostData).forEach((post) => {
        const postCreationTime = moment(post.createdAt);

        if (postCreationTime.isAfter(cutoffTime)) {
          const score = calculateScore(post);

          if (score > highestScore) {
            if (isBetterPost(post, currentUser)) {
              highestScore = score;
              bestPost = { ...post, score: score };
            }
          } else if (
            score === highestScore &&
            postCreationTime.isAfter(moment(bestPost.createdAt))
          ) {
            bestPost = { ...post, score: score };
          }
        }
      });

      let language = currentUser.wordslang;
      let collection = "tweetVoice";
      await updateViewsList(bestPost, currentUser, language, collection);

      if (bestPost) {
        return bestPost;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const restPostByVoice = async (tweetVoiceData, currentUser) => {
  if (!tweetVoiceData || !currentUser) return null;

  let posts = Object.entries(tweetVoiceData)
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

  for (let post of posts) {
    if (!post.viewsList) {
      post.viewsList = [];
    } else if (!Object.isExtensible(post.viewsList)) {
    }
    const newViewsList = Array.from(post.viewsList);
    if (!newViewsList.includes(currentUser.userId)) {
      newViewsList.push(currentUser.userId);

      const postRef = ref(
        database,
        `tweetVoice/${currentUser.wordslang}/${post.id}`
      );
      await update(postRef, { viewsList: newViewsList })
        .then(() => {})
        .catch((error) =>
          console.error("Failed to update post viewsList", error)
        );
    }
  }
  return posts;
};

const calculateScore = (post) => {
  const likeListLength = Array.isArray(post.likeList)
    ? post.likeList.length
    : 0;
  const commentCount = post.commentCount || 0;
  const views = Array.isArray(post.viewsList) ? post.viewsList.length : 0;
  return likeListLength * 100 + commentCount * 10 + views;
};

const isBetterPost = (post, currentUser) => {
  const viewsList = Array.isArray(post.viewsList) ? post.viewsList : [];

  return (
    post.Subject &&
    post.Subject !== "1" &&
    viewsList.includes(currentUser.userId) &&
    (!post.parentkey || (post.parentkey && post.childkey)) &&
    (!post.reportList ||
      (!post.reportList.includes(currentUser.userId) &&
        post.reportList.length <= 6))
  );
};

const updateViewsList = async (bestPost, currentUser, language, collection) => {
  if (
    bestPost &&
    currentUser.userId &&
    (!bestPost.viewsList || !bestPost.viewsList.includes(currentUser.userId))
  ) {
    let postRef;
    if (collection === "tweetVoice") {
      postRef = ref(database, `tweetVoice/${language}/${bestPost.id}`);
    } else {
      postRef = ref(
        database,
        `tweetCountry/${currentUser.country}/${bestPost.id}`
      );
    }
    const updatedViewsList = bestPost.viewsList
      ? [...bestPost.viewsList, currentUser.userId]
      : [currentUser.userId];
    await update(postRef, { viewsList: updatedViewsList });
  }
};
