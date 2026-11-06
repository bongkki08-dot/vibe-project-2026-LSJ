import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { initialBoardPosts } from "../board-seed.js";
import { db } from "./firebase-config.js";

const COLLECTION_NAME = "posts";

export async function migrateBoardPosts() {
  const results = await Promise.all(
    initialBoardPosts.map(async (post) => {
      const postReference = doc(db, COLLECTION_NAME, post.id);
      const existingPost = await getDoc(postReference);
      if (existingPost.exists()) return "skipped";

      const { id, ...postData } = post;
      await setDoc(postReference, postData);
      return "imported";
    })
  );

  return {
    imported: results.filter((result) => result === "imported").length,
    skipped: results.filter((result) => result === "skipped").length,
  };
}
