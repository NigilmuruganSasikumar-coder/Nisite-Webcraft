// ==========================================
// OFFBEAT Admin Login
// login.js
// Firebase Credential Verification
// ==========================================


import {

    db,
    doc,
    getDoc

} from "./database.js";



const loginForm =
document.getElementById("loginForm");



loginForm.addEventListener(
"submit",
async function(e){


    e.preventDefault();



    const userId =
    document.getElementById("userId")
    .value
    .trim();



    const password =
    document.getElementById("password")
    .value
    .trim();



    const errorBox =
    document.getElementById("loginError");



    try{


        // Get admin credentials

        const settingsRef =
        doc(
            db,
            "settings",
            "company"
        );



        const settingsSnap =
        await getDoc(settingsRef);



        if(!settingsSnap.exists()){


            errorBox.innerHTML =
            "Admin account not created.";


            return;

        }



        const adminData =
        settingsSnap.data();



        // Check login

        if(

            userId === adminData.adminUserId &&

            password === adminData.adminPassword

        ){



            sessionStorage.setItem(
                "adminLogin",
                "true"
            );



            window.location.href =
            "settings.html";



        }


        else{


            errorBox.innerHTML =
            "Invalid User ID or Password";


        }



    }


    catch(error){


        console.error(
            "Login error:",
            error
        );


        errorBox.innerHTML =
        "Login failed. Try again.";


    }



});