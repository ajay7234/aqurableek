import { getDatabase, ref, get, update } from "firebase/database";

const db = getDatabase();
export const findFollowerList = async (followerUsers) => {
  const promises = (followerUsers || [])?.map(async (userId) => {
    const userRef = ref(db, "profile/" + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });

  const results = await Promise.all(promises);
  const userData = results.filter((data) => data !== null);

  return userData;
};

export const findFollowingList = async (followingUsers) => {
  const promises = (followingUsers || [])?.map(async (userId) => {
    const userRef = ref(db, "profile/" + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });

  const results = await Promise.all(promises);
  const userData = results.filter((data) => data !== null);

  return userData;
};

export const toggleFollowUser = async (currentUserId, targetUserId) => {
  try {
    // References to the current user and the target user
    const currentUserRef = ref(db, `profile/${currentUserId}`);
    const targetUserRef = ref(db, `profile/${targetUserId}`);

    // Fetch current user and target user data
    const currentUserSnapshot = await get(currentUserRef);
    const targetUserSnapshot = await get(targetUserRef);

    if (currentUserSnapshot.exists() && targetUserSnapshot.exists()) {
      const currentUserData = currentUserSnapshot.val();
      const targetUserData = targetUserSnapshot.val();

      // Check if current user is already following the target user
      const isFollowing =
        currentUserData.followingList &&
        currentUserData.followingList.includes(targetUserId);
      const updates = {};

      if (isFollowing) {
        // Unfollow logic
        updates[`/profile/${currentUserId}/followingList`] =
          currentUserData.followingList.filter((id) => id !== targetUserId);
        updates[`/profile/${currentUserId}/following`] =
          currentUserData.following - 1; // Decrease following count

        updates[`/profile/${targetUserId}/followerList`] =
          targetUserData.followerList.filter((id) => id !== currentUserId);
        updates[`/profile/${targetUserId}/followers`] =
          targetUserData.followers - 1; // Decrease follower count
      } else {
        // Follow logic
        updates[`/profile/${currentUserId}/followingList`] = [
          ...(currentUserData.followingList || []),
          targetUserId,
        ];
        updates[`/profile/${currentUserId}/following`] =
          (currentUserData.following || 0) + 1; // Increase following count

        updates[`/profile/${targetUserId}/followerList`] = [
          ...(targetUserData.followerList || []),
          currentUserId,
        ];
        updates[`/profile/${targetUserId}/followers`] =
          (targetUserData.followers || 0) + 1; // Increase follower count
      }

      // Update both users' profiles in the database
      await update(ref(db), updates);

      return {
        success: true,
        message: isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully",
      };
    } else {
      throw new Error("User profiles not found.");
    }
  } catch (error) {
    console.error("Error toggling follow status:", error);
    return { success: false, message: error.message };
  }
};
