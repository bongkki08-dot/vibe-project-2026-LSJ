import { initialBoardPosts } from "./board-seed.js";
import { storageHelper } from "./storage-helper.js";

const COLLECTION_NAME = "posts";

function createId() {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("crypto.randomUUID is required to create board posts.");
  }

  return globalThis.crypto.randomUUID();
}

export const boardMockService = {
  initialize: async () => {
    if (!(await storageHelper.has(COLLECTION_NAME))) {
      await storageHelper.set(COLLECTION_NAME, initialBoardPosts);
      return;
    }

    const storedPosts = await storageHelper.get(COLLECTION_NAME, []);
    const storedIds = new Set(storedPosts.map((post) => post.id));
    const missingSeedPosts = initialBoardPosts.filter(
      (post) => !storedIds.has(post.id)
    );

    if (missingSeedPosts.length > 0) {
      await storageHelper.set(COLLECTION_NAME, [
        ...storedPosts,
        ...missingSeedPosts,
      ]);
    }
  },

  getAll: async () => storageHelper.get(COLLECTION_NAME, []),

  getById: async (id) => {
    const posts = await storageHelper.get(COLLECTION_NAME, []);
    return posts.find((post) => post.id === id) ?? null;
  },

  create: async (postData) => {
    const posts = await storageHelper.get(COLLECTION_NAME, []);
    const now = new Date().toISOString();
    const post = {
      ...postData,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };

    posts.unshift(post);
    await storageHelper.set(COLLECTION_NAME, posts);
    return post;
  },

  update: async (id, changes) => {
    const posts = await storageHelper.get(COLLECTION_NAME, []);
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex === -1) throw new Error(`Board post "${id}" was not found.`);

    const updatedPost = {
      ...posts[postIndex],
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    posts[postIndex] = updatedPost;
    await storageHelper.set(COLLECTION_NAME, posts);
    return updatedPost;
  },

  delete: async (id) => {
    const posts = await storageHelper.get(COLLECTION_NAME, []);
    await storageHelper.set(
      COLLECTION_NAME,
      posts.filter((post) => post.id !== id)
    );
  },
};
