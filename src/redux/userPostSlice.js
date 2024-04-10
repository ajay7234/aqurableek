import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get, getDatabase, ref } from "firebase/database";

const database = getDatabase();

export const getUserPostData = createAsyncThunk(
  "userPost/getUserPostData",
  async (userId, { rejectWithValue }) => {
    try {
      let userProfile;
      const userRef = ref(database, `profile/${userId}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        userProfile = userSnapshot.val();
      } else {
        return rejectWithValue("User profile does not exist");
      }
      let userPosts = [];
      const postRef = ref(database, `/tweetVoice/${userProfile.wordslang}`);
      const postSnapshot = await get(postRef);

      if (postSnapshot.exists()) {
        postSnapshot.forEach((childSnapshot) => {
          const post = childSnapshot.val();
          if (post.userId === userId) {
            userPosts.push({ id: childSnapshot.key, ...post });
          }
        });
      }
      return { userProfile, userPosts: userPosts.reverse() };
    } catch (error) {
      console.error("Failed to fetch user data", error);
      return rejectWithValue(error.message);
    }
  }
);

const userPostSlice = createSlice({
  name: "userPost",
  initialState: {
    userProfile: null,
    userPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearpost: (state) => {
      state.userProfile = null;
      state.userPosts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPostData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserPostData.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.userProfile;
        state.userPosts = action.payload.userPosts;
      })
      .addCase(getUserPostData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userPostSlice.reducer;
export const { clearpost } = userPostSlice.actions;
