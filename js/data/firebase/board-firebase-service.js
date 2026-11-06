import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const COLLECTION_NAME = "posts";
const postsCollection = collection(db, COLLECTION_NAME);

function toBoardPost(snapshot) {
  const post = snapshot.data();
  return { ...post, id: snapshot.id };
}

export const boardFirebaseService = {
  initialize: async () => {},

  getInquiries: async () => {
    const inquiriesCollection = collection(db, "inquiries");
    const inquiriesQuery = query(inquiriesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(inquiriesQuery);
    return snapshot.docs
      .map(toBoardPost)
      .filter((inquiry) => inquiry.boardType === "inquiry");
  },

  createInquiry: async ({ author, title, content, questionType, isPrivate }) => {
    const now = new Date().toISOString();
    const inquiry = {
      author,
      title,
      content,
      boardType: "inquiry",
      questionType,
      isPrivate: Boolean(isPrivate),
      answer: null,
      createdAt: now,
      updatedAt: now,
    };
    const document = await addDoc(collection(db, "inquiries"), inquiry);
    return { ...inquiry, id: document.id };
  },

  updateInquiry: async (id, changes) => {
    const inquiryReference = doc(db, "inquiries", id);
    const updatedInquiry = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(inquiryReference, updatedInquiry);
    return { id, ...updatedInquiry };
  },

  deleteInquiry: async (id) => {
    await deleteDoc(doc(db, "inquiries", id));
  },

  answerInquiry: async (id, { author, content }) => {
    const now = new Date().toISOString();
    const answer = {
      author,
      content,
      createdAt: now,
      updatedAt: now,
    };
    await updateDoc(doc(db, "inquiries", id), {
      answer,
      updatedAt: now,
    });
    return answer;
  },

  getAll: async () => {
    const snapshot = await getDocs(postsCollection);
    return snapshot.docs
      .map(toBoardPost)
      .filter((post) => post.boardType === "notice" || post.boardType === "faq");
  },

  getById: async (id) => {
    const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
    return snapshot.exists() ? toBoardPost(snapshot) : null;
  },

  create: async (postData) => {
    const now = new Date().toISOString();
    const post = {
      ...postData,
      createdAt: now,
      updatedAt: now,
    };
    const document = await addDoc(postsCollection, post);
    return { ...post, id: document.id };
  },

  update: async (id, changes) => {
    const postReference = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(postReference);
    if (!snapshot.exists()) {
      throw new Error(`Board post "${id}" was not found.`);
    }

    const updatedPost = {
      ...toBoardPost(snapshot),
      ...changes,
      id,
      updatedAt: new Date().toISOString(),
    };
    const documentData = { ...updatedPost };
    delete documentData.id;
    await updateDoc(postReference, documentData);
    return updatedPost;
  },

  delete: async (id) => {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },
};
