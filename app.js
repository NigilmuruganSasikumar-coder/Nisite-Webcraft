// ==========================================
// OFFBEAT Parcel Management
// app.js
// Dashboard
// ==========================================

import {
    db,
    collection,
    getDocs,
    query,
    orderBy
} from "./database.js";


// ==========================================
// APP LOGIN PROTECTION
// ==========================================

const userLogin = sessionStorage.getItem("userLogin");

if (userLogin !== "true") {

    window.location.href = "login1.html";

}

const recentOrders = document.getElementById("recentOrders");

const todayParcel = document.getElementById("todayParcel");
const pendingParcel = document.getElementById("pendingParcel");
const shippedParcel = document.getElementById("shippedParcel");
const customerCount = document.getElementById("customerCount");

let parcels = [];

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {

    try {

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

        loadRecentOrders();
        updateStatistics();

    }

    catch (error) {

        console.error(error);

        recentOrders.innerHTML =
            "<p style='padding:20px;text-align:center'>Unable to load data.</p>";

    }

}

loadDashboard();


// ==========================================
// Recent Orders
// ==========================================

// ==========================================
// Recent Orders (Premium UI)
// ==========================================

function loadRecentOrders() {

    recentOrders.innerHTML = "";

    if (parcels.length === 0) {

        recentOrders.innerHTML = `
            <div class="empty-orders">
                <i class="fa-solid fa-box-open"></i>
                <h4>No Parcels Found</h4>
                <p>Create your first parcel to see it here.</p>
            </div>
        `;

        return;
    }

    parcels.slice(0, 5).forEach(parcel => {

        const status = parcel.status || "Pending";

        let badgeClass = "status-pending";

        if (status.toLowerCase() === "shipped") {
            badgeClass = "status-shipped";
        }

        if (status.toLowerCase() === "delivered") {
            badgeClass = "status-delivered";
        }

        let created = "";

        if (parcel.createdAt?.toDate) {
            created = parcel.createdAt.toDate().toLocaleString();
        }

        const card = document.createElement("div");

        card.className = "recent-order-card";

        card.innerHTML = `

            <div class="recent-top">

                <div>

                    <h4>${parcel.orderId}</h4>

                    <span>${created}</span>

                </div>

                <div class="${badgeClass}">
                    ${status}
                </div>

            </div>

            <div class="recent-middle">

                <div>
                    <i class="fa-solid fa-user"></i>
                    ${parcel.customerName || "-"}
                </div>

                <div>
                    <i class="fa-solid fa-phone"></i>
                    ${parcel.phone || "-"}
                </div>

            </div>

            <div class="recent-bottom">

                <div>

                    <i class="fa-solid fa-box"></i>

                    ${parcel.product || "-"}

                </div>

                <div>

                    <i class="fa-solid fa-truck"></i>

                    ${parcel.courier || "-"}

                </div>

                <i class="fa-solid fa-chevron-right arrow"></i>

            </div>

        `;

        card.onclick = () => {

            sessionStorage.setItem("currentOrderId", parcel.orderId);

            window.location.href = "label-v2.html";

        };

        recentOrders.appendChild(card);

    });

}

// ==========================================
// Statistics
// ==========================================

function updateStatistics() {

    // Today's Parcels

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let todayCount = 0;
    let pending = 0;
    let shipped = 0;

    const customers = new Set();

    parcels.forEach(parcel => {

        // Customers

        if (parcel.customerName)
            customers.add(parcel.customerName);

        // Status

        const status = (parcel.status || "").toLowerCase();

        if (status === "pending")
            pending++;

        if (status === "shipped")
            shipped++;

        // Today

        if (parcel.createdAt?.toDate) {

            const created = parcel.createdAt.toDate();

            created.setHours(0, 0, 0, 0);

            if (created.getTime() === today.getTime()) {

                todayCount++;

            }

        }

    });

    if (todayParcel)
        todayParcel.textContent = todayCount;

    if (pendingParcel)
        pendingParcel.textContent = pending;

    if (shippedParcel)
        shippedParcel.textContent = shipped;

    if (customerCount)
        customerCount.textContent = customers.size;

}