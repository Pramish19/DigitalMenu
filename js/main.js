const menuContainer = document.getElementById("menu");
const orderItems = document.getElementById("order-items");
const totalElement = document.getElementById("total");
const tablesContainer = document.getElementById("tables-container");

let order = [];
let total = 0;
let selectedTable = null;

// Fetch and display menu items
fetch("php/menu.php")
    .then((response) => response.json())
    .then((data) => {
        data.forEach((dish) => {
            const dishDiv = document.createElement("div");
            dishDiv.innerHTML = `
            <div class="order-card">
<div class="order-description">
<h3>${dish.name} ($${dish.price})</h3>
<p>${dish.description}</p>
</div>
                <button onclick="addToOrder(${dish.id}, '${dish.name}', ${dish.price})">Add to Order</button>
                <div>
            `;
            menuContainer.appendChild(dishDiv);
        });
    })
    .catch((err) => console.error("Error loading menu:", err));

// Add a dish to the order
function addToOrder(id, name, price) {
    const existing = order.find((item) => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        order.push({ id, name, price, quantity: 1 });
    }
    updateOrder();
}

// Update the order summary
function updateOrder() {
    orderItems.innerHTML = "";
    total = 0;


    order.forEach((item) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.className = "order-item";
        li.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">x${item.quantity}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItems.appendChild(li);
    });

    totalElement.innerText =`$${total.toFixed(2)}`;
}

// Load available tables and display them
function loadAvailableTables() {
    fetch("php/fetchTables.php?status=available")
        .then((response) => response.json())
        .then((tables) => {
            tablesContainer.innerHTML = ""; // Clear existing tables

            if (tables.length === 0) {
                tablesContainer.innerHTML = "<p>No tables available.</p>";
                return;
            }

            tables.forEach((table) => {
                const tableDiv = document.createElement("div");
                tableDiv.classList.add("table");
                tableDiv.innerHTML = `
                    <p>Table ${table.table_number}</p>
                    <button onclick="selectTable(${table.table_number})">Select Table</button>
                `;
                tablesContainer.appendChild(tableDiv);
            });
        })
        .catch((err) => console.error("Error loading tables:", err));
}

// Select a table
function selectTable(tableNumber) {
    fetch("php/updateTable.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableNumber }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                selectedTable = tableNumber;
                alert(`Table ${tableNumber} selected successfully!`);
                loadAvailableTables(); // Reload tables to remove the selected one
            } else {
                alert("Failed to update table information.");
            }
        })
        .catch((err) => console.error("Error:", err));
}

// Place an order
function placeOrder() {
    if (!selectedTable) {
        alert("Please select a table first.");
        return;
    }

    const orderData = {
        table: selectedTable,
        order: order.map((item) => ({ id: item.id, quantity: item.quantity })),
        total: total,
    };

    fetch("php/order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Order placed successfully!");
                // Clear order and reset total
                order = [];
                total = 0;
                updateOrder();
                loadAvailableTables(); // Reload available tables
            } else {
                alert(data.message);
            }
        })
        .catch((err) => console.error("Error placing order:", err));
}

function clearOrder() {
if (confirm("Are you sure want to reset the order")){
    order=[]
    total=0
    orderItems.innerHTML=''
    totalElement.innerText= total.toFixed(2) 
    alert("Order has been reset!")
}
}

// Load available tables on page load
document.addEventListener("DOMContentLoaded", () => {
    loadAvailableTables();
});
