import { boardService } from "../data/board-service.js";
import { auth, onAuthStateChanged } from "../data/firebase/firebase-config.js";

const form = document.querySelector("[data-inquiry-write-form]");
const loginMessage = document.querySelector("[data-inquiry-write-login-message]");
const message = document.querySelector("[data-inquiry-write-message]");

if (form) {
  let currentUser = null;
  const submitButton = form.querySelector('[type="submit"]');

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    form.hidden = !user;
    loginMessage.hidden = Boolean(user);
    if (user) form.elements.questionType.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const data = new FormData(form);
    const questionType = data.get("questionType");
    const title = data.get("title").trim();
    const content = data.get("content").trim();
    if (!questionType || !title || !content) {
      message.textContent = "질문 유형, 제목, 내용을 모두 입력해 주세요.";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "문의 등록 중입니다.";
    try {
      await boardService.createInquiry({
        author: {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email || "회원",
        },
        title,
        content,
        questionType,
        isPrivate: data.get("isPrivate") === "on",
      });
      window.location.href = "./inquiry.html";
    } catch (error) {
      console.error("Failed to create inquiry.", error);
      message.textContent = "문의 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      submitButton.disabled = false;
    }
  });
}
