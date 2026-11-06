import { authService } from "../data/firebase/auth-service.js";

const loginForm = document.querySelector("[data-auth-login-form]");
const signupForm = document.querySelector("[data-auth-signup-form]");

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("board-state--error", isError);
}

function getAuthErrorMessage(error) {
  if (error.message === "이미 사용 중인 아이디입니다.") return error.message;

  const messages = {
    "auth/email-already-in-use": "이미 가입된 이메일입니다.",
    "auth/invalid-email": "올바른 이메일 주소를 입력해 주세요.",
    "auth/invalid-credential": "이메일 또는 비밀번호를 확인해 주세요.",
    "auth/weak-password": "비밀번호는 6자 이상으로 입력해 주세요.",
    "auth/too-many-requests": "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
    "auth/network-request-failed": "네트워크 연결을 확인해 주세요.",
    "permission-denied": "Firebase 권한을 확인해 주세요.",
  };
  return messages[error.code] || error.message || "요청을 처리하지 못했습니다.";
}

if (loginForm) {
  const message = loginForm.querySelector("[data-auth-message]");
  const submitButton = loginForm.querySelector('[type="submit"]');

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    submitButton.disabled = true;
    setMessage(message, "로그인 중입니다.");

    try {
      await authService.signIn(formData.get("email"), formData.get("password"));
      window.location.assign("./notice.html");
    } catch (error) {
      console.error("Failed to sign in.", error);
      setMessage(message, getAuthErrorMessage(error), true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (signupForm) {
  const usernameInput = signupForm.elements.username;
  const checkButton = signupForm.querySelector("[data-check-username]");
  const usernameMessage = signupForm.querySelector("[data-username-message]");
  const formMessage = signupForm.querySelector("[data-signup-message]");
  const submitButton = signupForm.querySelector('[type="submit"]');
  let checkedUsername = "";

  usernameInput.addEventListener("input", () => {
    checkedUsername = "";
    setMessage(usernameMessage, "아이디 중복 확인이 필요합니다.");
  });

  checkButton.addEventListener("click", async () => {
    checkButton.disabled = true;
    try {
      const username = usernameInput.value.trim();
      const result = await authService.checkUsername(username);
      if (result.reason === "invalid") {
        checkedUsername = "";
        setMessage(usernameMessage, "아이디는 영문, 숫자, 밑줄, 하이픈으로 4~20자 입력해 주세요.", true);
      } else if (result.available) {
        checkedUsername = username.toLowerCase();
        setMessage(usernameMessage, "사용할 수 있는 아이디입니다.");
      } else {
        checkedUsername = "";
        setMessage(usernameMessage, "이미 사용 중인 아이디입니다.", true);
      }
    } catch (error) {
      console.error("Failed to check username availability.", error);
      checkedUsername = "";
      setMessage(usernameMessage, getAuthErrorMessage(error), true);
    } finally {
      checkButton.disabled = false;
    }
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const username = formData.get("username").trim().toLowerCase();
    if (username !== checkedUsername) {
      setMessage(usernameMessage, "아이디 중복 확인을 해 주세요.", true);
      usernameInput.focus();
      return;
    }

    submitButton.disabled = true;
    setMessage(formMessage, "회원가입 중입니다.");

    try {
      await authService.register({
        name: formData.get("name"),
        username,
        email: formData.get("email"),
        password: formData.get("password"),
      });
      setMessage(formMessage, "회원가입이 완료되었습니다. 로그인 상태입니다.");
      signupForm.reset();
      checkedUsername = "";
      setMessage(usernameMessage, "아이디 중복 확인이 필요합니다.");
    } catch (error) {
      console.error("Failed to register.", error);
      setMessage(formMessage, getAuthErrorMessage(error), true);
    } finally {
      submitButton.disabled = false;
    }
  });
}
