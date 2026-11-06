import { authService } from "./data/firebase/auth-service.js";

const authLoginLinks = document.querySelectorAll("[data-auth-login]");
const authSignupLinks = document.querySelectorAll("[data-auth-signup]");
const authLogoutButtons = document.querySelectorAll("[data-auth-logout]");
const authWelcomeElements = document.querySelectorAll("[data-auth-welcome]");
const authUserNameElements = document.querySelectorAll("[data-auth-user-name]");

function setHidden(elements, hidden) {
  elements.forEach((element) => {
    element.hidden = hidden;
  });
}

authLogoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Failed to sign out.", error);
      window.alert("로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  });
});

authService.onAuthStateChanged(async (user) => {
  let profile = null;
  if (user) {
    try {
      profile = await authService.getProfile(user);
    } catch (error) {
      console.error("Failed to load the signed-in user profile.", error);
    }
  }

  const isSignedIn = Boolean(user);
  const displayName = profile?.name || user?.displayName || user?.email || "";
  setHidden(authLoginLinks, isSignedIn);
  setHidden(authSignupLinks, isSignedIn);
  setHidden(authLogoutButtons, !isSignedIn);
  setHidden(authWelcomeElements, !isSignedIn);
  setHidden(authUserNameElements, !isSignedIn);

  authWelcomeElements.forEach((element) => {
    element.textContent = `${displayName}님 환영합니다.`;
  });
  authUserNameElements.forEach((element) => {
    element.textContent = `${displayName}님 환영합니다.`;
  });

  document.dispatchEvent(
    new CustomEvent("firebase-auth-state", {
      detail: {
        user,
        profile,
        isAdmin: profile?.role === "admin",
      },
    })
  );
});
