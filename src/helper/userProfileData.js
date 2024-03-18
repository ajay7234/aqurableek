import { onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import { auth } from "../Firebase/Firebase";

const database = getDatabase();

export const getUserData = () => {
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
