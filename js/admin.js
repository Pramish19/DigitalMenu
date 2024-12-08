// Dish Management Section
document
  .getElementById("add-dish-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const category = document.getElementById("category").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);

    const dishData = { category, name, description, price };

    fetch("php/addDish.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dishData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          loadMenu(); // Reload the menu list
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error adding dish:", err));
  });

function loadMenu() {
  fetch("php/menu.php")
    .then((response) => response.json())
    .then((data) => {
      const menuList = document.getElementById("menu-list");
      menuList.innerHTML = "";

      data.forEach((dish) => {
        const price = parseFloat(dish.price);
        if (isNaN(price)) {
          console.error("Invalid price for dish:", dish.name);
          return;
        }

        const dishDiv = document.createElement("div");
        dishDiv.innerHTML = `
          <p>${dish.name} - $${price.toFixed(2)}</p>
          <button onclick="deleteDish(${dish.id})">Delete</button>
        `;
        menuList.appendChild(dishDiv);
      });
    })
    .catch((err) => console.error("Error loading menu:", err));
}

function deleteDish(dishId) {
  if (confirm("Are you sure you want to delete this dish?")) {
    fetch("php/deleteDish.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dishId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          loadMenu(); // Reload the menu list
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error deleting dish:", err));
  }
}


// Table Management Section
function addTable() {
    const tableNumber = parseInt(document.getElementById("table-number").value);
  
    if (isNaN(tableNumber) || tableNumber <= 0) {
      alert("Please enter a valid table number.");
      return;
    }
  
    fetch("php/addTable.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tableNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          loadTableStatuses(); // Reload table statuses
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error("Error adding table:", err));
  }
  
  function loadTableStatuses() {
    fetch("php/fetchTables.php")
      .then((response) => response.json())
      .then((tables) => {
        const tableManagement = document.getElementById("admin-tables-container");
        tableManagement.innerHTML = "";
  
        tables.forEach((table) => {
          const tableDiv = document.createElement("div");
          tableDiv.innerHTML = `
            <p>Table ${table.table}: ${table.status}</p>
            <button onclick="updateTableStatus(${table.table}, 'available')">Mark as Available</button>
            <button onclick="updateTableStatus(${table.table}, 'occupied')">Mark as Occupied</button>
          `;
          tableManagement.appendChild(tableDiv);
        });
      })
      .catch((err) => console.error("Error loading table statuses:", err));
  }

  function loadTables() {
    fetch("php/fetchTables.php")
      .then((response) => response.json())
      .then((tables) => {
        const tablesContainer = document.getElementById("admin-tables-container");
        console.log("Fetched tables:", tables); // Debug: Verify fetched tables
        tablesContainer.innerHTML = ""; // Clear the current list
  
        tables.forEach((table) => {
          const tableDiv = document.createElement("div");
          tableDiv.innerHTML = `
            <p>Table ${table.table_number} - Status: ${table.status}</p>
            <button onclick="updateTableStatus(${table.table_number}, 'available')">Mark as Available</button>
            <button onclick="updateTableStatus(${table.table_number}, 'occupied')">Mark as Occupied</button>
          `;
          tablesContainer.appendChild(tableDiv);
        });
      })
      .catch((err) => console.error("Error loading tables:", err));
  }
  
  
  
  function updateTableStatus(tableNumber, status) {
    const payload = { table_number: tableNumber, status: status };
  
    fetch("php/updateTableStatus.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update response:", data); // Debugging response
        if (data.success) {
          alert(data.message);
          loadTables(); // Reload the updated table list
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error("Error updating table status:", err));
  }
  
   
  

  

  // Order Management Section
function loadOrders() {
    const orderList = document.getElementById("order-list");
  
    if (!orderList) {
      console.error("Order list element not found!");
      return;
    }
  
    fetch("php/fetchOrders.php")
      .then((response) => response.json())
      .then((tables) => {
        orderList.innerHTML = ""; // Clear any existing orders
  
        tables.forEach((table) => {
          const orderDiv = document.createElement("div");
          orderDiv.innerHTML = `
            <div class="order-header">
            <h3>Table ${table.table}</h3>
            <p class="order-count">Total Orders: ${table.orders.length}</p>
        </div>
        <ul class="order-details">
            ${table.orders.flat().map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="order-footer">
            <p><strong>Total Amount:</strong> $${table.total.toFixed(2)}</p>
        </div>
        <hr class="order-divider">
          `;
          orderList.appendChild(orderDiv);
        });
      })
      .catch((err) => console.error("Error loading orders:", err));
  }

  
  // Initialize functionalities on page load
document.addEventListener("DOMContentLoaded", () => {
    loadMenu(); // Load the menu data
    loadTableStatuses(); // Load table statuses
    loadOrders(); // Load orders
    loadTables();
  });
  