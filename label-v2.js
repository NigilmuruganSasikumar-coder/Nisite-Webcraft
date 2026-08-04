/*====================================================
        OFFBEAT Shipping Label V2
        Part 1
        Developed by Nisite Webcraft
====================================================*/

import {
    db,
    collection,
    getDocs,
    query,
    where
} from "./database.js";


/*==========================
      GET ORDER ID
==========================*/

const currentOrderId = sessionStorage.getItem("currentOrderId");

if (!currentOrderId) {

    alert("No Parcel Selected!");

    window.location.href = "new-parcel.html";

}


/*==========================
      LOAD PARCEL
==========================*/

let parcel = null;

async function loadParcel() {

    try {

        const q = query(
            collection(db, "parcels"),
            where("orderId", "==", currentOrderId)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("Parcel Not Found!");

            window.location.href = "new-parcel.html";

            return;

        }

        parcel = snapshot.docs[0].data();

        fillLabel();

    }

    catch (error) {

        console.error(error);

        alert("Unable to Load Parcel.");

    }

}


/*==========================
        ELEMENTS
==========================*/

const customerName = document.getElementById("customerName");

const phone = document.getElementById("phone");

const address = document.getElementById("address");

const city = document.getElementById("city");

const district = document.getElementById("district");

const state = document.getElementById("state");

const pincode = document.getElementById("pincode");

const payment = document.getElementById("payment");

const amount = document.getElementById("amount");

const date = document.getElementById("date");

const product = document.getElementById("product");

const size = document.getElementById("size");

const color = document.getElementById("color");

const qty = document.getElementById("qty");

const weight = document.getElementById("weight");

const courier = document.getElementById("courier");

const tracking = document.getElementById("tracking");

const status = document.getElementById("status");


/*==========================
      FILL LABEL
==========================*/

function fillLabel() {

    customerName.textContent = parcel.customerName || "-";

    phone.textContent = parcel.phone || "-";

    address.textContent = parcel.address || "-";

    city.textContent = parcel.city || "-";

    district.textContent = parcel.district || "-";

    state.textContent = parcel.state || "-";

    pincode.textContent = parcel.pincode || "-";

    payment.textContent = parcel.payment || "-";

    amount.textContent = parcel.amount || "0";

    date.textContent = parcel.bookingDate || "-";

    product.textContent = parcel.product || "-";

    size.textContent = parcel.size || "-";

    color.textContent = parcel.color || "-";

    qty.textContent = parcel.qty || "-";

    weight.textContent = parcel.weight || "-";

    courier.textContent = parcel.courier || "-";

    tracking.textContent = parcel.tracking || "-";

    document.title = `OFFBEAT - ${parcel.customerName}`;

    status.textContent = parcel.status || "-";

    // Generate QR & Barcode
    generateQRCode();

    generateBarcode();

}


/*==========================
      START APPLICATION
==========================*/

loadParcel();
/*==========================
        QR DATA
==========================*/
function getQRData() {

    return `Order ID: ${parcel.orderId}
Customer: ${parcel.customerName}

product: ${parcel.product}
Size: ${parcel.size}
Color: ${parcel.color}
`;

}


/*==========================
      GENERATE QR CODE
==========================*/

function generateQRCode() {

    const qrContainer = document.getElementById("qrcode");

    if (!qrContainer) return;

    qrContainer.innerHTML = "";

    new QRCode(qrContainer, {
        text: getQRData(),
        width: 60,
        height: 80,
        correctLevel: QRCode.CorrectLevel.H
    });

}

/*==========================
      GENERATE BARCODE
==========================*/
function generateBarcode() {

    const barcodeSVG = document.getElementById("barcode");

    if (!barcodeSVG) return;

    barcodeSVG.innerHTML = "";

    const barcodeData =
`${parcel.tracking}`;

    JsBarcode(barcodeSVG, barcodeData, {

        format: "CODE128",

        width: 2,

        height: 70,

        displayValue: true,

        fontSize: 14,

        margin: 10,

        lineColor: "#000000",

        background: "#ffffff"

    });

}
/*==========================
      CONSOLE
==========================*/

console.log("QR Code Generated");

console.log("Barcode Generated");
/*====================================================
                PART 3
        PRINT • SAVE IMAGE • PDF
====================================================*/

/*==========================
        BUTTONS
==========================*/

const printBtn = document.getElementById("printBtn");

const imageBtn = document.getElementById("imageBtn");

const pdfBtn = document.getElementById("pdfBtn");


/*==========================
        PRINT LABEL
==========================*/

if (printBtn) {

    printBtn.addEventListener("click", () => {

        window.print();

    });

}


/*==========================
        SAVE IMAGE
==========================*/

if (imageBtn) {

    imageBtn.addEventListener("click", saveImage);

}


async function saveImage() {

    const label = document.getElementById("label");

    try {

        enableExportMode();

        imageBtn.disabled = true;

        imageBtn.innerHTML =
            "<i class='fa-solid fa-spinner fa-spin'></i> Saving...";

        const canvas = await html2canvas(label, {

            scale: 5,

            useCORS: true,

            backgroundColor: "#ffffff",

            logging: false,

            imageTimeout: 0

        });

        disableExportMode();

        imageBtn.disabled = false;

        imageBtn.innerHTML =
            "<i class='fa-solid fa-image'></i> Save Image";

        const link = document.createElement("a");

        const fileName = (
            parcel.customerName || parcel.orderId
        ).replace(/\s+/g, "_");

        link.download = fileName + "_Label.png";

        link.href = canvas.toDataURL("image/png", 1.0);

        link.click();

    }

    catch (error) {

        console.error(error);

        disableExportMode();

        imageBtn.disabled = false;

        imageBtn.innerHTML =
            "<i class='fa-solid fa-image'></i> Save Image";

        alert("Unable to save image.");

    }

}


/*==========================
        DOWNLOAD PDF
==========================*/

if (pdfBtn) {

    pdfBtn.addEventListener("click", downloadPDF);

}


async function downloadPDF() {

    const label = document.getElementById("label");

    try {

        enableExportMode();

        pdfBtn.disabled = true;

        pdfBtn.innerHTML =
            "<i class='fa-solid fa-spinner fa-spin'></i> Creating...";

        const canvas = await html2canvas(label, {

            scale: 5,

            useCORS: true,

            backgroundColor: "#ffffff",

            logging: false,

            imageTimeout: 0

        });

        disableExportMode();

        const imgData = canvas.toDataURL("image/png", 1.0);

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: [148, 105]

        });

        pdf.addImage(

            imgData,

            "PNG",

            0,

            0,

            105,

            148,

            undefined,

            "FAST"

        );

        const fileName = (
            parcel.customerName || parcel.orderId
        ).replace(/\s+/g, "_");

        pdf.save(fileName + "_Label.pdf");

        pdfBtn.disabled = false;

        pdfBtn.innerHTML =
            "<i class='fa-solid fa-file-pdf'></i> Download PDF";

    }

    catch (error) {

        console.error(error);

        disableExportMode();

        pdfBtn.disabled = false;

        pdfBtn.innerHTML =
            "<i class='fa-solid fa-file-pdf'></i> Download PDF";

        alert("Unable to create PDF.");

    }

}


/*==========================
        EXPORT MODE
==========================*/

function enableExportMode() {

    document
        .getElementById("label")
        .classList
        .add("export-mode");

}


function disableExportMode() {

    document
        .getElementById("label")
        .classList
        .remove("export-mode");

}
/*====================================================
                PART 4
        HELPERS & INITIALIZATION
====================================================*/


/*==========================
        HELPERS
==========================*/

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


function currentDate() {

    const d = new Date();

    return d.toLocaleDateString("en-IN");

}


/*==========================
      AUTO DATE
==========================*/

if (date && date.textContent.trim() === "-") {

    date.textContent = currentDate();

}


/*==========================
      PAGE TITLE
==========================*/



/*==========================
    DISABLE TEXT SELECTION
==========================*/

document.addEventListener("selectstart", (event) => {

    event.preventDefault();

});


/*==========================
      DISABLE IMAGE DRAG
==========================*/

document.querySelectorAll("img").forEach((img) => {

    img.setAttribute("draggable", "false");

});


/*==========================
      KEYBOARD SHORTCUTS
==========================*/

document.addEventListener("keydown", (event) => {

    // Ctrl + P
    if (event.ctrlKey && event.key.toLowerCase() === "p") {

        event.preventDefault();

        window.print();

    }

});


/*==========================
      PAGE LOADED
==========================*/

window.addEventListener("load", () => {

    console.log("========================================");

    console.log("OFFBEAT Parcel Management");

    console.log("Shipping Label V2 Loaded");

    console.log("Firestore Connected");

    console.log("QR Code Ready");

    console.log("Barcode Ready");

    console.log("Developed by Nisite Webcraft");

    console.log("========================================");

});