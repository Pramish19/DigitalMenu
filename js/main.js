const menuContainer = document.getElementById("menu");
const orderItems = document.getElementById("order-items");
const totalElement = document.getElementById("total");
const tablesContainer = document.getElementById("tables-container");

let order = [];
let total = 0;
let selectedTable = null;

// Fetch and display menu items
// fetch("php/menu.php")
//   .then((response) => response.json())
//   .then((data) => {
//     data.forEach((dish) => {
//       const dishDiv = document.createElement("div");
//       dishDiv.innerHTML = `
//             <div class="order-card">
// <div class="order-description">
// <h1>${dish.category}</h1>
// <h3>${dish.name} ($${dish.price})</h3>
// <p>${dish.description}</p>
// </div>
//                 <button onclick="addToOrder(${dish.id}, '${dish.name}', ${dish.price})">Add to Order</button>
//                 <div>
//             `;
//       menuContainer.appendChild(dishDiv);
//     });
//   })
//   .catch((err) => console.error("Error loading menu:", err));



fetch("php/menu.php")
  .then((response) => response.json())
  .then((data) => {
    // dishes anusar le group garako category lai
    const groupedDishes = data.reduce((acc, dish) => {
      if (!acc[dish.category]) {
        acc[dish.category] = []; // category ko lagi array initialize gareko
      }
      acc[dish.category].push(dish); // Aappropriate group anusar dish add gareko
      return acc;
    }, {});

    //categories ko group anusar chai iterate gare ra render gareko
    Object.keys(groupedDishes).forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-section"); // csss style ko lagi la
      categoryDiv.innerHTML = `<h2>${category}</h2>`; // category ko header yeha haleko

      groupedDishes[category].forEach((dish) => {
        const dishDiv = document.createElement("div");
        dishDiv.innerHTML = `
              <div class="order-card">
                  <div class="order-description">
                      <h3>${dish.name} ($${dish.price})</h3>
                      <p>${dish.description}</p>
                  </div>
                  <button onclick="addToOrder(${dish.id}, '${dish.name}', ${dish.price})">Add to Order</button>
              </div>
          `;
        categoryDiv.appendChild(dishDiv);
      });

      //menu ma group append gareko
      menuContainer.appendChild(categoryDiv);
    });
  })
  .catch((err) => console.error("Error loading menu:", err));






// order ma dish add gareko
function addToOrder(id, name, price) {
  const existing = order.find((item) => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    order.push({ id, name, price, quantity: 1 });
  }
  updateOrder();
}

// order gareko summary update gareko
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
            <span class="item-price">$${(item.price * item.quantity).toFixed(
              2
            )}</span>
        `;
    orderItems.appendChild(li);
  });

  totalElement.innerText = `$${total.toFixed(2)}`;
}

// available vako table load ani display gareko
// function loadAvailableTables() {
//   fetch("php/fetchTables.php?status=available")
//     .then((response) => response.json())
//     .then((tables) => {
//       tablesContainer.innerHTML = ""; // existing table lai clear gareko

//       if (tables.length === 0) {
//         tablesContainer.innerHTML = "<p>No tables available.</p>";
//         return;
//       }

//       tables.forEach((table) => {
//         const tableDiv = document.createElement("div");
//         tableDiv.classList.add("table");
//         tableDiv.innerHTML = `
//                     <p>Table ${table.table_number}</p>
//                     <button onclick="selectTable(${table.table_number})">Select Table</button>
//                 `;
//         tablesContainer.appendChild(tableDiv);
//       });
//     })
//     .catch((err) => console.error("Error loading tables:", err));
// }


function loadTables() {
    fetch("php/fetchTables.php") // Fetch all tables without filtering by status
      .then((response) => response.json())
      .then((tables) => {
        tablesContainer.innerHTML = ""; // Clear existing table content
  
        if (tables.length === 0) {
          tablesContainer.innerHTML = "<p>No tables found.</p>";
          return;
        }
  
        // Separate tables by status
        const availableTables = tables.filter(
          (table) => table.status === "available"
        );
        const occupiedTables = tables.filter(
          (table) => table.status === "occupied"
        );
  
        // Render available tables
        const availableSection = document.createElement("div");
        availableSection.innerHTML = "<h3>Available Tables</h3>";
        availableTables.forEach((table) => {
          const tableDiv = document.createElement("div");
          tableDiv.classList.add("table", "available");
          tableDiv.innerHTML = `
            <p>Table ${table.table_number}</p>
            <button onclick="selectTable(${table.table_number})">Select Table</button>
          `;
          availableSection.appendChild(tableDiv);
        });
  
        // Render occupied tables
        const occupiedSection = document.createElement("div");
        occupiedSection.innerHTML = "<h3>Occupied Tables</h3>";
        occupiedTables.forEach((table) => {
          const tableDiv = document.createElement("div");
          tableDiv.classList.add("table", "occupied");
          tableDiv.innerHTML = `
            <p>Table ${table.table_number} (Occupied)</p>
            <button disabled>Unavailable</button>
          `;
          occupiedSection.appendChild(tableDiv);
        });
  
        // Append both sections to the tables container
        tablesContainer.appendChild(availableSection);
        tablesContainer.appendChild(occupiedSection);
      })
      .catch((err) => console.error("Error loading tables:", err));
  }
  
  // Load tables on page load
  document.addEventListener("DOMContentLoaded", () => {
    loadTables();
  });
  

// table select gareko
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
        loadAvailableTables();  //table relode gareko selcet gareko table lai remove garna
      } else {
        alert("Failed to update table information.");
      }
    })
    .catch((err) => console.error("Error:", err));
}

// order place gareko
function placeOrder() {
  if (!selectedTable) {
    alert("Please select a table first.");
    return;
  }

  const orderData = {
    table: selectedTable,
    order: order.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
    })),
    total: total,
  };

  fetch("php/order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to place order");
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        alert("Order placed successfully!");
        order = [];
        total = 0;
        updateOrder();
        loadTables();
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.error("Error placing order:", err));
}

function clearOrder() {
  if (confirm("Are you sure want to reset the order")) {
    order = [];
    total = 0;
    orderItems.innerHTML = "";
    totalElement.innerText = total.toFixed(2);
    alert("Order has been reset!");
  }
}

 //available vako tabels lai forntedn ma load gareko
document.addEventListener("DOMContentLoaded", () => {
//   loadAvailableTables();
loadTables();
});
