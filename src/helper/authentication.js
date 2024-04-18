import { getDatabase, ref, update } from "firebase/database";
import { app, auth } from "../Firebase/Firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { createdDate } from "./fetchTweetData";

const database = getDatabase();

export const createUser = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    return user.multiFactor.user;
  } catch (error) {
    let errorMessage = error.message;
    errorMessage = errorMessage.replace("Firebase: ", "");
    errorMessage = errorMessage.replace(/ *\([^)]*\) */g, "");
    toast.error(errorMessage);
  }
};

export const signUpWithDetails = async (
  firstName,
  lastName,
  email,
  displayName,
  dob,
  country,
  wordslang,
  gender,
  createdAt,
  userId
) => {
  try {
    const userRef = ref(database, "/profile/" + userId);

    await update(userRef, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      displayName: displayName,
      dob: dob,
      country: country,
      wordslang: wordslang,
      gender: gender,
      createdAt: createdAt,
      userId: userId,
    });
  } catch (error) {
    toast.error(error.message);
    console.error("Failed to store data", error);
  }
};

export const signInWithDetails = async (email, password) => {
  try {
    const response = await auth.signInWithEmailAndPassword(email, password);
    return response.user;
  } catch (error) {
    let errorMessage = error.message;
    errorMessage = errorMessage.replace("Firebase: ", "");
    errorMessage = errorMessage.replace(/ *\([^)]*\) */g, "");
    toast.error(errorMessage);
  }
};

export const signInWithGoogleProvider = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const [firstName, lastName] = user.displayName
        ? user.displayName.split(" ")
        : ["", ""];
      const email = user.email;
      const displayName = user.displayName;
      const dob = "";
      const country = "🇲🇦 Morocco";
      const wordslang = "Arabic worlds";
      const gender = "";
      const createdAt = createdDate();
      const userId = user.uid;

      await signUpWithDetails(
        firstName,
        lastName,
        email,
        displayName,
        dob,
        country,
        wordslang,
        gender,
        createdAt,
        userId
      );
    }

    return user;
  } catch (error) {
    let errorMessage = error.message;
    errorMessage = errorMessage.replace("Firebase: ", "");
    errorMessage = errorMessage.replace(/ *\([^)]*\) */g, "");
    toast.error(errorMessage);
  }
};
