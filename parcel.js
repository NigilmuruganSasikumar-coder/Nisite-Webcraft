// ==========================================
// OFFBEAT Parcel Management
// parcel.js
// Developed by Nisite Webcraft
// ==========================================

import {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "./database.js";


// ==========================================
// ELEMENTS
// ==========================================

const form = document.getElementById("parcelForm");

const orderId = document.getElementById("orderId");

const customerName = document.getElementById("customerName");

const phone = document.getElementById("phone");

const address = document.getElementById("address");

const city = document.getElementById("city");

const district = document.getElementById("district");

const state = document.getElementById("state");

const pincode = document.getElementById("pincode");

const product = document.getElementById("product");

const size = document.getElementById("size");

const color = document.getElementById("color");

const qty = document.getElementById("qty");

const weight = document.getElementById("weight");

const courier = document.getElementById("courier");

const tracking = document.getElementById("tracking");

const payment = document.getElementById("payment");

const amount = document.getElementById("amount");

const notes = document.getElementById("notes");

const labelBtn = document.getElementById("labelBtn");

// ==========================================
// EDIT MODE
// ==========================================

let editMode = false;

let editParcelId = sessionStorage.getItem("editParcelId");

// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener("DOMContentLoaded", async () => {

    if (editParcelId) {

        editMode = true;

        await loadParcelForEdit();

    }

    else {

        await generateOrderID();

    }

});

// ==========================================
// LOAD PARCEL FOR EDIT
// ==========================================

async function loadParcelForEdit() {

    try {

        const ref = doc(db, "parcels", editParcelId);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            alert("Parcel not found.");

            return;

        }

        const parcel = snap.data();

        orderId.value = parcel.orderId;

        customerName.value = parcel.customerName;

        phone.value = parcel.phone;

        address.value = parcel.address;

        city.value = parcel.city;

        district.value = parcel.district;

        state.value = parcel.state;

        pincode.value = parcel.pincode;

        product.value = parcel.product;

        size.value = parcel.size;

        color.value = parcel.color;

        qty.value = parcel.qty;

        weight.value = parcel.weight;

        courier.value = parcel.courier;

        tracking.value = parcel.tracking;

        payment.value = parcel.payment;

        amount.value = parcel.amount;

        notes.value = parcel.notes;

        labelBtn.innerHTML = "Update Parcel";

    }

    catch (error) {

        console.error(error);

    }

}
// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Alert Message
function showMessage(message) {

    alert(message);

}


// Button Loading
function setLoading(isLoading) {

    labelBtn.disabled = isLoading;

    if (isLoading) {

        labelBtn.innerHTML = editMode
            ? "Updating Parcel..."
            : "Generating Label...";

    } else {

        labelBtn.innerHTML = editMode
            ? "Update Parcel"
            : "Generate Label";

    }

}


// Clear Customer Details
function clearCustomerDetails() {

    customerName.value = "";

    address.value = "";

    city.value = "";

    district.value = "";

    state.value = "";

    pincode.value = "";

}


// ==========================================
// GENERATE ORDER ID
// ==========================================

async function generateOrderID() {

    try {

        const q = query(
            collection(db, "parcels"),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);

        let nextNumber = 1;

        if (!snapshot.empty) {

            const lastOrder = snapshot.docs[0].data().orderId;

            if (lastOrder) {

                nextNumber =
                    parseInt(lastOrder.replace("OB", "")) + 1;

            }

        }

        orderId.value =
            "OB" + String(nextNumber).padStart(6, "0");

    }

    catch (error) {

        console.error(error);

        orderId.value =
            "OB000001";

    }

}


// ==========================================
// GET PARCEL DATA
// ==========================================

function getParcelData() {

    return {

        orderId: orderId.value.trim(),

        customerName: customerName.value.trim(),

        phone: phone.value.trim(),

        address: address.value.trim(),

        city: city.value.trim(),

        district: district.value.trim(),

        state: state.value.trim(),

        pincode: pincode.value.trim(),

        product: product.value.trim(),

        size: size.value.trim(),

        color: color.value.trim(),

        qty: Number(qty.value),

        weight: weight.value.trim(),

        courier: courier.value.trim(),

        tracking: tracking.value.trim(),

        payment: payment.value,

        amount: Number(amount.value || 0),

        notes: notes.value.trim(),

        status: "Shipped",

        bookingDate: new Date().toLocaleDateString(),

        createdAt: serverTimestamp()

    };

}
// ==========================================
// AUTO FILL CUSTOMER DETAILS
// ==========================================

phone.addEventListener("keyup", async () => {

    if (phone.value.length !== 10) {

        clearCustomerDetails();

        return;

    }

    try {

        const customerQuery = query(
            collection(db, "parcels"),
            where("phone", "==", phone.value)
        );

        const snapshot = await getDocs(customerQuery);

        if (snapshot.empty) {

            return;

        }

        // Get latest parcel of this customer
        const customer = snapshot.docs[snapshot.docs.length - 1].data();

        customerName.value = customer.customerName || "";

        address.value = customer.address || "";

        city.value = customer.city || "";

        district.value = customer.district || "";

        state.value = customer.state || "";

        pincode.value = customer.pincode || "";

    }

    catch (error) {

        console.error("Customer Search Error :", error);

    }

});


// ==========================================
// PHONE VALIDATION
// ==========================================

phone.addEventListener("input", () => {

    phone.value = phone.value.replace(/\D/g, "");

    phone.value = phone.value.slice(0, 10);

});


// ==========================================
// PINCODE VALIDATION
// ==========================================

pincode.addEventListener("input", () => {

    pincode.value = pincode.value.replace(/\D/g, "");

    pincode.value = pincode.value.slice(0, 6);

});


// ==========================================
// QUANTITY VALIDATION
// ==========================================

qty.addEventListener("input", () => {

    qty.value = qty.value.replace(/\D/g, "");

    if (qty.value === "") return;

    if (Number(qty.value) < 1) {

        qty.value = 1;

    }

});


// ==========================================
// WEIGHT VALIDATION
// ==========================================

weight.addEventListener("input", () => {

    if (Number(weight.value) < 0) {

        weight.value = "";

    }

});


// ==========================================
// AMOUNT VALIDATION
// ==========================================

amount.addEventListener("input", () => {

    if (Number(amount.value) < 0) {

        amount.value = "";

    }

});


// ==========================================
// REMOVE LEADING SPACES
// ==========================================

[
    customerName,
    address,
    city,
    district,
    state,
    product,
    size,
    color,
    courier,
    tracking,
    notes
].forEach(input => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/^\s+/, "");

    });

});


// ==========================================
// CUSTOMER NAME FORMAT
// ==========================================

customerName.addEventListener("blur", () => {

    customerName.value = customerName.value
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());

});


// ==========================================
// TRACKING NUMBER UPPERCASE
// ==========================================

tracking.addEventListener("input", () => {

    tracking.value = tracking.value.toUpperCase();

});


// ==========================================
// FORM VALIDATION
// ==========================================

function validateForm() {

    if (!customerName.value.trim()) {

        showMessage("Please Enter Customer Name");

        customerName.focus();

        return false;

    }

    if (phone.value.length !== 10) {

        showMessage("Please Enter a Valid Phone Number");

        phone.focus();

        return false;

    }

    if (!address.value.trim()) {

        showMessage("Please Enter Address");

        address.focus();

        return false;

    }

    if (!city.value.trim()) {

        showMessage("Please Enter City");

        city.focus();

        return false;

    }

    if (!district.value.trim()) {

        showMessage("Please Enter District");

        district.focus();

        return false;

    }

    if (!state.value.trim()) {

        showMessage("Please Enter State");

        state.focus();

        return false;

    }

    if (pincode.value.length !== 6) {

        showMessage("Please Enter a Valid Pincode");

        pincode.focus();

        return false;

    }

    if (!product.value.trim()) {

        showMessage("Please Enter Product Name");

        product.focus();

        return false;

    }

    if (qty.value === "" || Number(qty.value) <= 0) {

        showMessage("Quantity should be greater than 0");

        qty.focus();

        return false;

    }

    if (!weight.value.trim()) {

        showMessage("Please Enter Weight");

        weight.focus();

        return false;

    }

    if (Number(amount.value) < 0) {

        showMessage("Invalid Amount");

        amount.focus();

        return false;

    }

    return true;

}
// ==========================================
// GENERATE LABEL
// (Auto Save + Open Label)
// ==========================================

labelBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    // Validate Form
    if (!validateForm()) {

        return;

    }

    try {

        setLoading(true);

        // Check Duplicate Order ID
        // Only check duplicate Order ID for NEW parcels
if (!editMode) {

    const duplicateQuery = query(
        collection(db, "parcels"),
        where("orderId", "==", orderId.value)
    );

    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {

        alert("Order ID already exists.");

        return;

    }

}

        // Get Form Data
        const parcel = getParcelData();

if (editMode) {

    await updateDoc(
    doc(db, "parcels", editParcelId),
    {
        ...parcel,
        updatedAt: serverTimestamp(),
        edited: true
    }
);

    console.log("Parcel Updated Successfully");

} else {

    await addDoc(
        collection(db, "parcels"),
        parcel
    );

    console.log("Parcel Added Successfully");

}

        // Pass Order ID to Label Page
        sessionStorage.removeItem("editParcelId");
        sessionStorage.setItem(
            "currentOrderId",
            parcel.orderId
        );

        // Open Label Page
        window.location.href = "label-v2.html";

    }

    catch (error) {

        console.error("Firestore Error :", error);

        showMessage(
            "Unable to Generate Label.\nPlease try again."
        );

    }

    finally {

        setLoading(false);

    }

});


// ==========================================
// PREVENT FORM SUBMIT
// ==========================================

form.addEventListener("submit", (event) => {

    event.preventDefault();

});


// ==========================================
// GENERATE NEW ORDER ID WHEN RESET
// ==========================================

form.addEventListener("reset", async () => {

    setTimeout(async () => {

        clearCustomerDetails();

        await generateOrderID();

    }, 100);

});