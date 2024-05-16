import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUserData } from "../helper/userProfileData";
import {
  get,
  getDatabase,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { getTodayDate } from "../helper/uploadData";
import { auth } from "../Firebase/Firebase";
const database = getDatabase();

const timestamp720HoursAgo = getTodayDate(720);

export const fetchCollectionData = createAsyncThunk(
  "user/fetchCollectionData",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const userData = await getCurrentUserData();

      const currentUserId = auth.currentUser.uid;
      const userDataRef = ref(database, `profile/`);
      let data = {};
      let currentUser = {};
      onValue(userDataRef, (snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          currentUser = data[currentUserId];
          dispatch(setAllUsersData(data));
          dispatch(setUserData(currentUser));
        }
      });

      const tweetVoiceRef = ref(database, `tweetVoice/${userData.wordslang}`);
      const recentTweetVoiceQuery = query(
        tweetVoiceRef,
        orderByChild("createdAt")
      );
      let tweetVoiceData = {};
      onValue(recentTweetVoiceQuery, (snapshot) => {
        if (snapshot.exists()) {
          tweetVoiceData = snapshot.val();
          dispatch(setTweetVoiceData(tweetVoiceData));
        }
      });

      const tweetCountryRef = ref(database, `tweetCountry/${userData.country}`);
      const recentTweetCountryQuery = query(
        tweetCountryRef,
        orderByChild("createdAt"),
        startAt(timestamp720HoursAgo)
      );
      let tweetCountryData = {};
      onValue(recentTweetCountryQuery, (snapshot) => {
        if (snapshot.exists()) {
          tweetCountryData = snapshot.val();
          dispatch(setTweetCountryData(tweetCountryData));
        }
      });

      const englishPostRef = ref(database, `/tweetVoice/English worlds`);
      const recentEnglishPostQuery = query(
        englishPostRef,
        orderByChild("createdAt"),
        startAt(timestamp720HoursAgo)
      );
      let englishPostData = {};
      onValue(recentEnglishPostQuery, (snapshot) => {
        if (snapshot.exists()) {
          englishPostData = snapshot.val();
          dispatch(setTweetEnglishData(englishPostData));
        }
      });

      return {
        userData: userData,
        //tweetVoice: tweetVoiceData,
        //tweetCountry: tweetCountryData,
        //englishPost: englishPostData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    status: "idle",
    error: null,

    userData: {},
    tweetVoice: {},
    tweetCountry: {},
    englishPost: {},
    AllUsersData: {},
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setAllUsersData: (state, action) => {
      state.AllUsersData = action.payload;
    },
    setTweetVoiceData: (state, action) => {
      state.tweetVoice = action.payload;
    },
    setTweetCountryData: (state, action) => {
      state.tweetCountry = action.payload;
    },
    setTweetEnglishData: (state, action) => {
      state.englishPost = action.payload;
    },

    //
    //    updatePostLikeStatus: (state, action) => {
    //      const postId = action.payload.postId;
    //      const userId = action.payload.userId;
    //
    //      const updateLikeStatusInCollection = (collection) => {
    //        if (collection[postId]) {
    //          const isLiked = collection[postId].likeList?.includes(userId);
    //          const updatedLikeList = isLiked
    //            ? collection[postId].likeList.filter((id) => id !== userId)
    //            : [...(collection[postId].likeList || []), userId];
    //
    //          return {
    //            ...collection[postId],
    //            likeCount: isLiked
    //              ? collection[postId].likeCount - 1
    //              : collection[postId].likeCount + 1,
    //            likeList: updatedLikeList,
    //          };
    //        }
    //        return collection[postId];
    //      };
    //
    //      state.data.tweetVoice[postId] = updateLikeStatusInCollection(
    //        state.data.tweetVoice
    //      );
    //
    //      if (state.data.tweetCountry && state.data.tweetCountry[postId]) {
    //        state.data.tweetCountry[postId] = updateLikeStatusInCollection(
    //          state.data.tweetCountry
    //        );
    //      }
    //
    //      if (state.data.englishPost && state.data.englishPost[postId]) {
    //        state.data.englishPost[postId] = updateLikeStatusInCollection(
    //          state.data.englishPost
    //        );
    //      }
    //    },
    logout: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const {
  updatePostLikeStatus,
  logout,
  setUserData,
  setTweetVoiceData,
  setTweetCountryData,
  setTweetEnglishData,
  setAllUsersData,
} = userSlice.actions;
