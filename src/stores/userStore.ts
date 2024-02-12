import { useApi } from "@/composables/useApi";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import CredentialResponse = google.accounts.id.CredentialResponse;

const GOOGLE_IDENTITY_CLIENT_LIBRARY_SRC = "https://accounts.google.com/gsi/client";

export interface User {
  givenName: string;
  picture: string;
  email: string;
}

export const useUserStore = defineStore("userStore", () => {
  const isGoogleLoginLibraryAvailable = ref(false);
  const { data: userDetails, execute: fetchUserDetails } = useApi<User>("/api/v1/base", { immediate: false }).get();
  
  const isUserLoggedIn = computed(() => userDetails.value !== null && userDetails.value !== undefined);

  if (localStorage.getItem("token")) {
    fetchUserDetails();
  }

  function loadGoogleLoginLibrary() {
    if (window.google) {
      onScriptLoaded();
    } else {
      const script = document.createElement("script");
      script.src = GOOGLE_IDENTITY_CLIENT_LIBRARY_SRC;
      script.src = GOOGLE_IDENTITY_CLIENT_LIBRARY_SRC;
      script.onload = onScriptLoaded;
      script.onerror = handleScriptError;
      script.async = true;

      document.head.appendChild(script);
    }
  }

  function showGoogleLoginButton(loginButtonWrapperId: string) {
    // Display the "Sign in with Google" button
    window.google.accounts.id.renderButton(
      document.getElementById(loginButtonWrapperId) as HTMLElement,
      { type: "standard", theme: "outline", size: "large" },
    );

    // Display the One Tap dialog
    window.google.accounts.id.prompt();
  }

  function onScriptLoaded() {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_IDENTITY_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    isGoogleLoginLibraryAvailable.value = true;
  }

  function handleScriptError(error: any) {
    console.log(error)
  }

  async function handleGoogleLogin(response: CredentialResponse) {
    const { data: userAuth } = await useApi<{ status: "success"; token: "token" }>(
      "/token").post({ id_token: response.credential });
    console.log(userAuth.value!.token)
    localStorage.setItem("token", userAuth.value!.token);
    fetchUserDetails();
  }

  function logOut() {
    localStorage.removeItem("token");
    userDetails.value = null;
    // sign out of google library
  }

  return {
    userDetails,
    isGoogleLoginLibraryAvailable,

    isUserLoggedIn,

    fetchUserDetails,
    loadGoogleLoginLibrary,
    showGoogleLoginButton,
    logOut,
  }
});