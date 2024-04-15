import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUserData } from "../helper/userProfileData";
import {
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { getTodayDate } from "../helper/uploadData";

const database = getDatabase();

const timestamp720HoursAgo = getTodayDate(720);
export const fetchCollectionData = createAsyncThunk(
  "user/fetchCollectionData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getCurrentUserData();

      const tweetVoiceRef = ref(database, `tweetVoice/${userData.wordslang}`);
      const recentTweetVoiceQuery = query(
        tweetVoiceRef,
        orderByChild("createdAt")
      );
      const tweetVoiceSnapshot = await get(recentTweetVoiceQuery);
      let tweetVoiceData = {};
      if (tweetVoiceSnapshot.exists()) {
        tweetVoiceSnapshot.forEach((child) => {
          tweetVoiceData[child.key] = { id: child.key, ...child.val() };
        });
      }

      const tweetCountryRef = ref(database, `tweetCountry/${userData.country}`);
      const recentTweetCountryQuery = query(
        tweetCountryRef,
        orderByChild("createdAt"),
        startAt(timestamp720HoursAgo)
      );
      let tweetCountryData = {};
      const tweetCountrySnapshot = await get(recentTweetCountryQuery);
      if (tweetCountrySnapshot.exists()) {
        tweetCountrySnapshot.forEach((child) => {
          tweetCountryData[child.key] = { id: child.key, ...child.val() };
        });
      }

      let englishPostData = {};
      const englishPostRef = ref(database, `/tweetVoice/English worlds`);
      const recentEnglishPostQuery = query(
        englishPostRef,
        orderByChild("createdAt"),
        startAt(timestamp720HoursAgo)
      );
      const englishSnapshot = await get(recentEnglishPostQuery);
      if (englishSnapshot.exists()) {
        englishSnapshot.forEach((child) => {
          englishPostData[child.key] = { id: child.key, ...child.val() };
        });
      }
      return {
        userData: userData,
        tweetVoice: tweetVoiceData,
        tweetCountry: tweetCountryData,
        englishPost: englishPostData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await getCurrentUserData();
      return { userData };
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
  },
  reducers: {
    updatePostLikeStatus: (state, action) => {
      const postId = action.payload.postId;
      const userId = action.payload.userId;

      const updateLikeStatusInCollection = (collection) => {
        if (collection[postId]) {
          const isLiked = collection[postId].likeList?.includes(userId);
          const updatedLikeList = isLiked
            ? collection[postId].likeList.filter((id) => id !== userId)
            : [...(collection[postId].likeList || []), userId];

          return {
            ...collection[postId],
            likeCount: isLiked
              ? collection[postId].likeCount - 1
              : collection[postId].likeCount + 1,
            likeList: updatedLikeList,
          };
        }
        return collection[postId];
      };

      state.data.tweetVoice[postId] = updateLikeStatusInCollection(
        state.data.tweetVoice
      );

      if (state.data.tweetCountry && state.data.tweetCountry[postId]) {
        state.data.tweetCountry[postId] = updateLikeStatusInCollection(
          state.data.tweetCountry
        );
      }

      if (state.data.englishPost && state.data.englishPost[postId]) {
        state.data.englishPost[postId] = updateLikeStatusInCollection(
          state.data.englishPost
        );
      }
    },
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
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload.userData;
      });
  },
});

export default userSlice.reducer;
export const { updatePostLikeStatus, toggleFollowingStatus, logout } =
  userSlice.actions;
