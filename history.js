// ==========================================
// OFFBEAT Parcel History
// history.js
// Developed by Nisite Webcraft
// ==========================================

import {
    db,
    collection,
    getDocs,
    query,
    orderBy
} from "./database.js";


// ==========================================
// ELEMENTS
// ==========================================

const historyTable = document.getElementById("historyTable");

const searchInput = document.getElementById("searchInput");

const emptyState = document.getElementById("emptyState");

const filterButtons = document.querySelectorAll(".filter-btn");


// ==========================================
// GLOBAL DATA
// ==========================================

let parcels = [];

let filteredParcels = [];

let currentFilter = "all";


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    loadParcels();

});


// ==========================================
// LOAD PARCELS
// ==========================================

async function loadParcels() {

    try {

        historyTable.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;padding:30px;">
                Loading Parcels...
            </td>
        </tr>
        `;

        const q = query(

            collection(db, "parcels"),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        parcels = [];

        snapshot.forEach(doc => {

            parcels.push({

                id: doc.id,

                ...doc.data()

            });

        });

        filteredParcels = [...parcels];

        renderTable();

    }

    catch (error) {

        console.error(error);

        historyTable.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;color:red;">
                Unable to Load Parcels
            </td>
        </tr>
        `;

    }

}
// ==========================================
// RENDER TABLE
// ==========================================

function renderTable() {

    historyTable.innerHTML = "";

    if (filteredParcels.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    filteredParcels.forEach(parcel => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${parcel.orderId}</td>

            <td>
                <strong>${parcel.customerName}</strong><br>
                <small>${parcel.phone}</small>
            </td>

            <td>
                ${parcel.product}<br>
                <small>${parcel.size} | ${parcel.color}</small>
            </td>

            <td>${parcel.courier || "-"}</td>

            <td>${parcel.bookingDate || "-"}</td>

            <td>
                <div
                    id="qr-${parcel.id}"
                    class="table-qr">
                </div>
            </td>

            <td>

                <button
                    class="action-btn view-btn"
                    data-order="${parcel.orderId}"
                    title="View Label">

                    <i class="fa-solid fa-qrcode"></i>

                </button>

                <button
                    class="action-btn edit-btn"
                    data-id="${parcel.id}"
                    title="Edit Parcel">

                    <i class="fa-solid fa-pen-to-square"></i>

                </button>

            </td>

        `;

        historyTable.appendChild(row);

        generateSmallQR(parcel);

    });

    attachEvents();

}


// ==========================================
// SMALL QR CODE
// ==========================================

function generateSmallQR(parcel) {

    const container = document.getElementById(`qr-${parcel.id}`);

    if (!container) return;

    container.innerHTML = "";

    new QRCode(container, {

        text: parcel.orderId,

        width: 40,

        height: 40,

        colorDark: "#000",

        colorLight: "#fff",

        correctLevel: QRCode.CorrectLevel.M

    });

}


// ==========================================
// BUTTON EVENTS
// ==========================================

function attachEvents() {

    // View Label
    document.querySelectorAll(".view-btn").forEach(button => {

        button.onclick = () => {

            sessionStorage.setItem(

                "currentOrderId",

                button.dataset.order

            );

            window.location.href = "label-v2.html";

        };

    });


    // Edit Parcel
    document.querySelectorAll(".edit-btn").forEach(button => {

        button.onclick = () => {

            sessionStorage.setItem(

                "editParcelId",

                button.dataset.id

            );

            window.location.href = "new-parcel.html";

        };

    });

}
// ==========================================
// LIVE SEARCH
// ==========================================

searchInput.addEventListener("input", () => {

    applyFilters();

});


// ==========================================
// FILTER BUTTONS
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        // Add active class
        button.classList.add("active");

        currentFilter = button.dataset.filter;

        applyFilters();

    });

});


// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    filteredParcels = parcels.filter(parcel => {

        // -----------------------
        // Search
        // -----------------------

        const searchMatch =

            (parcel.orderId || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (parcel.customerName || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (parcel.phone || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (parcel.product || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (parcel.courier || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (parcel.tracking || "")
                .toLowerCase()
                .includes(keyword);


        // -----------------------
        // Date Filter
        // -----------------------

        let dateMatch = true;

if (currentFilter === "today") {

    dateMatch = isToday(parcel.bookingDate);

}

else if (currentFilter === "week") {

    dateMatch = isThisWeek(parcel.bookingDate);

}

else if (currentFilter === "updated") {

    dateMatch = !!parcel.updatedAt;

}

        return searchMatch && dateMatch;

    });

    renderTable();

}


// ==========================================
// TODAY FILTER
// ==========================================

function isToday(dateString) {

    if (!dateString) return false;

    let parcelDate;

    // Format: dd/mm/yyyy
    if (dateString.includes("/")) {

        const [day, month, year] = dateString.split("/");

        parcelDate = new Date(year, month - 1, day);

    }

    // Format: yyyy-mm-dd
    else {

        parcelDate = new Date(dateString);

    }

    const today = new Date();

    return (

        parcelDate.getDate() === today.getDate() &&

        parcelDate.getMonth() === today.getMonth() &&

        parcelDate.getFullYear() === today.getFullYear()

    );

}

// ==========================================
// WEEK FILTER
// ==========================================

function isThisWeek(dateString) {

    if (!dateString) return false;

    let parcelDate;

    // Format: dd/mm/yyyy
    if (dateString.includes("/")) {

        const [day, month, year] = dateString.split("/");

        parcelDate = new Date(year, month - 1, day);

    }

    // Format: yyyy-mm-dd
    else {

        parcelDate = new Date(dateString);

    }

    const today = new Date();

    const diff = today - parcelDate;

    const days = diff / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 7;

}

// ==========================================
// REFRESH HISTORY
// ==========================================

async function refreshHistory() {

    await loadParcels();

}


// ==========================================
// AUTO REFRESH
// ==========================================

window.addEventListener("focus", () => {

    refreshHistory();

});
// ==========================================
// STATUS BADGE
// ==========================================

function getStatusBadge(status) {

    switch ((status || "").toLowerCase()) {

        case "booked":

            return `<span class="status booked">Booked</span>`;

        case "shipped":

            return `<span class="status shipped">Shipped</span>`;

        case "out for delivery":

            return `<span class="status out">Out for Delivery</span>`;

        case "delivered":

            return `<span class="status delivered">Delivered</span>`;

        case "cancelled":

            return `<span class="status cancelled">Cancelled</span>`;

        default:

            return `<span class="status booked">Booked</span>`;

    }

}


// ==========================================
// FORMAT VALUE
// ==========================================

function formatValue(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "-";

    }

    return value;

}


// ==========================================
// TOTAL PARCEL COUNT
// ==========================================

function updateParcelCount() {

    document.title = `OFFBEAT Parcel History (${filteredParcels.length})`;

}


// ==========================================
// UPDATE AFTER RENDER
// ==========================================

const originalRenderTable = renderTable;

renderTable = function () {

    originalRenderTable();

    updateParcelCount();

};


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    historyTable.innerHTML = `

    <tr>

        <td colspan="7" style="text-align:center;padding:30px;">

            <i class="fa-solid fa-spinner fa-spin"></i>

            Loading...

        </td>

    </tr>

    `;

}


// ==========================================
// NO DATA
// ==========================================

function showEmptyState() {

    historyTable.innerHTML = "";

    emptyState.style.display = "block";

}


// ==========================================
// DISABLE IMAGE DRAG
// ==========================================

document.querySelectorAll("img").forEach(img => {

    img.setAttribute("draggable", "false");

});


// ==========================================
// DISABLE TEXT SELECTION
// ==========================================

document.addEventListener("selectstart", e => {

    e.preventDefault();

});


// ==========================================
// INITIALIZATION
// ==========================================

window.addEventListener("load", () => {

    console.log("===================================");

    console.log("OFFBEAT Parcel History");

    console.log("Firestore Connected");

    console.log("History Loaded Successfully");

    console.log("Developed by Nisite Webcraft");

    console.log("===================================");

});