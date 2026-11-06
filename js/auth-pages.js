// 로그인·회원가입 페이지 공통 스크립트 (Firebase Authentication, 이메일/비밀번호)
// firebase-config.js가 이미 앱을 초기화하고 auth를 내보내므로, 여기서는 그 auth를 가져다 쓴다.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "./data/firebase/firebase-config.js";

const ERROR_MESSAGES = {
  "auth/invalid-email": "이메일 형식이 올바르지 않아요.",
  "auth/email-already-in-use": "이미 가입된 이메일이에요. 로그인해 주세요.",
  "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
  "auth/missing-password": "비밀번호를 입력해 주세요.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 맞지 않아요.",
  "auth/user-not-found": "가입되지 않은 이메일이에요.",
  "auth/wrong-password": "이메일 또는 비밀번호가 맞지 않아요.",
  "auth/too-many-requests": "시도가 너무 많아요. 잠시 후 다시 해주세요.",
  "auth/operation-not-allowed": "Firebase 콘솔에서 이메일/비밀번호 로그인을 켜 주세요.",
  "auth/network-request-failed": "네트워크 연결을 확인해 주세요.",
};

function showMessage(form, text, isSuccess = false) {
  const el = form.querySelector("[data-auth-message]");
  el.textContent = text;
  el.classList.toggle("is-success", isSuccess);
}

function setBusy(form, busy) {
  form.querySelector(".auth-submit").disabled = busy;
}

async function handleLogin(form) {
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!email || !password) {
    showMessage(form, "이메일과 비밀번호를 입력해 주세요.");
    return;
  }
  await signInWithEmailAndPassword(auth, email, password);
  location.href = "../index.html";
}

async function handleSignup(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!name) return showMessage(form, "이름을 입력해 주세요.");
  if (!email) return showMessage(form, "이메일을 입력해 주세요.");
  if (password.length < 6) return showMessage(form, "비밀번호는 6자 이상이어야 해요.");
  if (password !== form.passwordConfirm.value) return showMessage(form, "비밀번호가 서로 달라요.");
  if (!form.agree.checked) return showMessage(form, "약관 동의에 체크해 주세요.");

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  showMessage(form, "가입이 완료됐어요. 잠시 후 이동합니다.", true);
  setTimeout(() => { location.href = "../index.html"; }, 800);
}

document.querySelectorAll("[data-auth-form]").forEach((form) => {
  const type = form.dataset.authForm;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(form, "");
    setBusy(form, true);
    try {
      if (type === "login") await handleLogin(form);
      else await handleSignup(form);
    } catch (error) {
      console.error(error);
      showMessage(form, ERROR_MESSAGES[error.code] ?? "문제가 생겼어요. 잠시 후 다시 해주세요.");
    } finally {
      setBusy(form, false);
    }
  });
});
