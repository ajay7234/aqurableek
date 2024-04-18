import { onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { auth } from "../Firebase/Firebase";
import { setUserData } from "../redux/userSlice";

const database = getDatabase();

export const getCurrentUserData = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          const userId = currentUser.uid;
          get(ref(database, "/profile/" + userId))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const userData = snapshot.val();
                resolve({ userId, ...userData });
              } else {
                resolve(null);
              }
            })
            .catch((error) => {
              console.error("Failed to fetch user data", error);
              reject(error);
            });
        } else {
          resolve(null);
        }
      },
      (error) => {
        console.error("Failed to subscribe to auth changes", error);
        reject(error);
      }
    );
  });
};

export const getUserProfileData = async (userId) => {
  let userProfile;
  const userRef = ref(database, `profile/${userId}`);

  try {
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      userProfile = userSnapshot.val();
    }
  } catch (error) {
    console.error("Failed to fetch user profile data", error);
    return null;
  }

  let userPosts = [];
  const postRef = ref(database, `/tweetVoice/${userProfile.wordslang}`);

  try {
    const postSnapshot = await get(postRef);
    if (postSnapshot.exists()) {
      postSnapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();
        if (post.userId === userId) {
          const postWithId = { id: childSnapshot.key, ...post };
          userPosts.push(postWithId);
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch user posts", error);
  }
  return {
    userProfile,
    userPosts: userPosts.reverse() || [],
  };
};
