
// ==========================================
// OFFBEAT Parcel Management
// settings.js
// Part 1 - Storage Information
// ==========================================
// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {

    db,
    collection,
    getDocs,
    getDoc,
    query,
    orderBy,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    where,
    serverTimestamp

} from "./database.js";


const adminLogin = sessionStorage.getItem("adminLogin");


if(adminLogin !== "true"){

    window.location.href = "login.html";

}
// ==========================================
// HTML ELEMENTS
// ==========================================

const totalParcels = document.getElementById("totalParcels");
const totalCustomers = document.getElementById("totalCustomers");
const lastOrder = document.getElementById("lastOrder");
const storageUsed = document.getElementById("storageUsed");


// ==========================================
// LOAD STORAGE INFORMATION
// ==========================================

async function loadStorageInformation() {

    try {

        const parcelQuery = query(
            collection(db, "parcels"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(parcelQuery);

        const parcels = [];

        snapshot.forEach((docSnap) => {

            parcels.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        updateStorageCards(parcels);

    }

    catch (error) {

        console.error("Error loading storage information:", error);

        totalParcels.textContent = "--";
        totalCustomers.textContent = "--";
        lastOrder.textContent = "--";
        storageUsed.textContent = "--";

    }

}


// ==========================================
// UPDATE STORAGE CARDS
// ==========================================

function updateStorageCards(parcels) {

    // Total Parcels

    totalParcels.textContent = parcels.length;


    // Total Customers (Unique)

    const customerSet = new Set();

    parcels.forEach(parcel => {

        if (parcel.customerName) {

            customerSet.add(
                parcel.customerName.trim().toLowerCase()
            );

        }

    });

    totalCustomers.textContent = customerSet.size;


    // Last Order

    if (parcels.length > 0) {

        lastOrder.textContent =
            parcels[0].orderId || "OB000000";

    }

    else {

        lastOrder.textContent = "OB000000";

    }


    // Estimated Storage Used

    const jsonData = JSON.stringify(parcels);

    const bytes = new TextEncoder().encode(jsonData).length;

    let storage = "";

    if (bytes < 1024) {

        storage = `${bytes} Bytes`;

    }

    else if (bytes < (1024 * 1024)) {

        storage = `${(bytes / 1024).toFixed(2)} KB`;

    }

    else {

        storage = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    }

    storageUsed.textContent = storage;

}


// ==========================================
// INITIALIZE
// ==========================================

loadStorageInformation();

// ==========================================
// ADMIN CREDENTIAL UPDATE
// ==========================================


const currentPasswordInput =
document.getElementById("currentPassword");


const newUserIdInput =
document.getElementById("newUserId");


const newPasswordInput =
document.getElementById("newPassword");


const updateCredentialsBtn =
document.getElementById("updateCredentialsBtn");




updateCredentialsBtn.addEventListener(
"click",
async()=>{


    const currentPassword =
    currentPasswordInput.value.trim();


    const newUserId =
    newUserIdInput.value.trim();


    const newPassword =
    newPasswordInput.value.trim();



    if(
        !currentPassword ||
        !newUserId ||
        !newPassword
    ){

        alert(
            "Please fill all fields."
        );

        return;

    }



    try{


        const settingsRef =
        doc(
            db,
            "settings",
            "company"
        );



        const settingsSnap =
        await getDoc(settingsRef);



        if(!settingsSnap.exists()){


            alert(
                "Admin settings not found."
            );


            return;

        }



        const data =
        settingsSnap.data();



        // Check old password

        if(
            currentPassword !==
            data.adminPassword
        ){


            alert(
                "Current password incorrect."
            );


            return;

        }




        await updateDoc(

            settingsRef,

            {

                adminUserId:
                newUserId,


                adminPassword:
                newPassword,


                updatedAt:
                serverTimestamp()

            }

        );



        alert(
            "Login credentials updated successfully."
        );



        currentPasswordInput.value="";
        newUserIdInput.value="";
        newPasswordInput.value="";



    }


    catch(error){


        console.error(
            error
        );


        alert(
            "Credential update failed."
        );


    }



});
// ==========================================
// LOGOUT ADMIN
// ==========================================


const logoutBtn =
document.getElementById("logoutBtn");



logoutBtn.addEventListener(
"click",
()=>{


    const confirmLogout =
    confirm(
        "Are you sure you want to logout?"
    );


    if(!confirmLogout){

        return;

    }



    // Remove admin session

    sessionStorage.removeItem(
        "adminLogin"
    );



    // Redirect to login

    window.location.href =
    "login1.html";


});

// ==========================================
// CLEAR SELECTED PARCEL
// DELETE ONE PARCEL USING ORDER ID
// ==========================================


const clearParcelBtn =
document.getElementById("clearParcelBtn");


const deleteOrderId =
document.getElementById("deleteOrderId");



clearParcelBtn.addEventListener(
"click",
async()=>{


    const orderId =
    deleteOrderId.value.trim();



    if(!orderId){


        alert(
            "Please enter Order ID."
        );

        return;

    }



    const confirmDelete =
    confirm(
        `Delete parcel ${orderId}?\n\nThis action cannot be undone.`
    );



    if(!confirmDelete){

        return;

    }



    try{


        const parcelQuery =
        query(

            collection(db,"parcels"),

            where(
                "orderId",
                "==",
                orderId
            )

        );



        const snapshot =
        await getDocs(parcelQuery);



        if(snapshot.empty){


            alert(
                "Parcel not found."
            );


            return;

        }



        const deleteTasks = [];



        snapshot.forEach((parcel)=>{


            deleteTasks.push(

                deleteDoc(

                    doc(
                        db,
                        "parcels",
                        parcel.id
                    )

                )

            );


        });



        await Promise.all(deleteTasks);



        alert(
            `${orderId} deleted successfully.`
        );



        deleteOrderId.value="";



        loadStorageInformation();



    }


    catch(error){


        console.error(
            "Delete parcel error:",
            error
        );


        alert(
            "Failed to delete parcel."
        );


    }



});
// ==========================================
// CLEAR PARCEL HISTORY
// DELETE ALL PARCEL DATA
// ==========================================


const clearHistoryBtn =
document.getElementById("clearHistoryBtn");



clearHistoryBtn.addEventListener(
"click",
async()=>{


    const confirmClear =
    confirm(
        "WARNING!\n\n" +
        "This will permanently delete all parcel history.\n\n" +
        "Do you want to continue?"
    );



    if(!confirmClear){

        return;

    }



    try{


        // Get all parcels

        const parcelSnapshot =
        await getDocs(
            collection(db,"parcels")
        );



        const deletePromises = [];



        // Delete every parcel document

        parcelSnapshot.forEach((parcel)=>{


            deletePromises.push(

                deleteDoc(

                    doc(
                        db,
                        "parcels",
                        parcel.id
                    )

                )

            );


        });



        await Promise.all(deletePromises);



        alert(
            "Parcel history cleared successfully."
        );



        // Update storage information

        loadStorageInformation();



    }


    catch(error){


        console.error(
            "Clear parcel history error:",
            error
        );


        alert(
            "Failed to clear parcel history."
        );


    }



});

// ==========================================
// APP LOGIN CREDENTIAL UPDATE
// ==========================================

const currentLoginPasswordInput =
document.getElementById("currentLoginPassword");

const newLoginUserIdInput =
document.getElementById("newLoginUserId");

const newLoginPasswordInput =
document.getElementById("newLoginPassword");

const updateLoginBtn =
document.getElementById("updateLoginBtn");


updateLoginBtn.addEventListener(
"click",
async()=>{


    const currentPassword =
    currentLoginPasswordInput.value.trim();

    const newUserId =
    newLoginUserIdInput.value.trim();

    const newPassword =
    newLoginPasswordInput.value.trim();


    if(
        !currentPassword ||
        !newUserId ||
        !newPassword
    ){

        alert(
            "Please fill all fields."
        );

        return;

    }


    try{


        const settingsRef =
        doc(
            db,
            "settings",
            "company"
        );


        const settingsSnap =
        await getDoc(settingsRef);


        if(!settingsSnap.exists()){

            alert(
                "Settings not found."
            );

            return;

        }


        const data =
        settingsSnap.data();


        // Verify current App password

        if(
            currentPassword !==
            data.loginPassword
        ){

            alert(
                "Current App Password is incorrect."
            );

            return;

        }


        // Update App Login

        await updateDoc(

            settingsRef,

            {

                loginUserId:
                newUserId,

                loginPassword:
                newPassword,

                updatedAt:
                serverTimestamp()

            }

        );


        alert(
            "App Login updated successfully."
        );


        currentLoginPasswordInput.value = "";
        newLoginUserIdInput.value = "";
        newLoginPasswordInput.value = "";


    }

    catch(error){

        console.error(
            "App Login Update Error:",
            error
        );

        alert(
            "Failed to update App Login."
        );

    }

});