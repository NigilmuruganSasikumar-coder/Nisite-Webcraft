// ==========================================
// OFFBEAT Parcel Management
// login.js
// App Login
// ==========================================

import {
    db,
    doc,
    getDoc
} from "./database.js";

// ==========================================
// HTML ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const userIdInput = document.getElementById("userId");

const passwordInput = document.getElementById("password");

const loadingScreen = document.getElementById("loadingScreen");

// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userId = userIdInput.value.trim();

    const password = passwordInput.value.trim();

    if (!userId || !password) {

        alert("Please enter User ID and Password.");

        return;

    }

    loadingScreen.classList.add("active");

    try {

        const settingsRef = doc(
            db,
            "settings",
            "company"
        );

        const settingsSnap = await getDoc(settingsRef);

        if (!settingsSnap.exists()) {

            loadingScreen.classList.remove("active");

            alert("Settings not found.");

            return;

        }

        const data = settingsSnap.data();

        // ======================================
        // APP LOGIN CHECK
        // ======================================

        if (
            userId === data.loginUserId &&
            password === data.loginPassword
        ) {

            sessionStorage.setItem("userLogin", "true");

            setTimeout(() => {

                window.location.href = "index.html";

            }, 800);

        }

        else {

            loadingScreen.classList.remove("active");

            alert("Invalid User ID or Password.");

        }

    }

    catch (error) {

        console.error(error);

        loadingScreen.classList.remove("active");

        alert("Login failed.");

    }

});
// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

const togglePassword =
document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="ri-eye-off-line"></i>';

    }

    else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="ri-eye-line"></i>';

    }

});