const EXPENSES_SHEET_ID = '1N-gHgwQInPXJJE1NUCjVod4Mlrne9qmxlv1_yMPYXwY'; // Replace with your actual expenses sheet ID
const PURCHASES_SHEET_ID = '1uAgeXX3YS320moHL7kP-NJA04WdsYJHLoET8sJo2-Xw'; // Replace with your actual purchases sheet ID
const API_KEY = 'AIzaSyARaqrxO_Q58vALp01ijHAGS9BUx2mt4LM'; // Replace with your actual API key

// Base URLs for Google Sheets API
const EXPENSES_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${EXPENSES_SHEET_ID}/values/`;
const PURCHASES_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${PURCHASES_SHEET_ID}/values/`;

// Function to add an expense to the "Expenses" sheet
async function addExpense(data) {
    const range = 'Expenses!A:C'; // Adjust sheet name and range if needed
    const url = `${EXPENSES_BASE_URL}${range}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            values: [
                [data.date, data.description, data.amount]
            ],
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add expense');
    }
}

// Function to add a purchase to the "Purchases" sheet
async function addPurchase(data) {
    const range = 'Purchases!A:E'; // Adjust sheet name and range if needed
    const url = `${PURCHASES_BASE_URL}${range}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            values: [
                [data.date, data.itemName, data.quantity, data.price, (data.quantity * data.price)]
            ],
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add purchase');
    }
}

// Handle form submissions and show appropriate section
document.addEventListener("DOMContentLoaded", function () {
    const expenseForm = document.getElementById("expenseForm");
    const purchaseForm = document.getElementById("purchaseForm");

    expenseForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const date = document.getElementById("expenseDate").value;
        const description = document.getElementById("expenseDescription").value;
        const amount = document.getElementById("expenseAmount").value;

        try {
            await addExpense({ date, description, amount });
            alert("Expense recorded!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to record expense.");
        }
        expenseForm.reset();
    });

    purchaseForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const date = document.getElementById("purchaseDate").value;
        const itemName = document.getElementById("purchaseItemName").value;
        const quantity = document.getElementById("purchaseQuantity").value;
        const price = document.getElementById("purchasePrice").value;

        try {
            await addPurchase({ date, itemName, quantity, price });
            alert("Purchase recorded!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to record purchase.");
        }
        purchaseForm.reset();
    });
});

// Function to show/hide sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach((section) => {
        section.classList.add("hidden");
    });
    document.getElementById(sectionId).classList.remove("hidden");
}
