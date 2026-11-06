import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  getDoc,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{4,20}$/;

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

export const authService = {
  checkUsername: async (username) => {
    const normalizedUsername = normalizeUsername(username);
    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      return { available: false, reason: "invalid" };
    }

    const usernameSnapshot = await getDoc(doc(db, "usernames", normalizedUsername));
    return { available: !usernameSnapshot.exists(), reason: "checked" };
  },

  register: async ({ name, username, email, password }) => {
    const normalizedUsername = normalizeUsername(username);
    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      throw new Error("아이디는 영문, 숫자, 밑줄, 하이픈으로 4~20자 입력해 주세요.");
    }

    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    try {
      await updateProfile(credential.user, { displayName: name.trim() });
      await runTransaction(db, async (transaction) => {
        const usernameReference = doc(db, "usernames", normalizedUsername);
        const usernameSnapshot = await transaction.get(usernameReference);
        if (usernameSnapshot.exists()) {
          throw new Error("이미 사용 중인 아이디입니다.");
        }

        transaction.set(usernameReference, { uid: credential.user.uid });
        transaction.set(doc(db, "users", credential.user.uid), {
          name: name.trim(),
          username: normalizedUsername,
          email: email.trim().toLowerCase(),
          role: "user",
        });
      });

      return credential.user;
    } catch (error) {
      try {
        await deleteUser(credential.user);
      } catch (cleanupError) {
        console.error("Could not remove the incomplete authentication account.", cleanupError);
        throw new Error(
          "회원 정보 저장에 실패했고 인증 계정 정리도 완료하지 못했습니다. Firebase Console에서 계정 상태를 확인해 주세요.",
          { cause: error }
        );
      }
      throw error;
    }
  },

  signIn: async (email, password) =>
    signInWithEmailAndPassword(auth, email.trim(), password),

  signOut: async () => signOut(auth),

  getProfile: async (user) => {
    const snapshot = await getDoc(doc(db, "users", user.uid));
    return snapshot.exists() ? snapshot.data() : null;
  },

  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
};
