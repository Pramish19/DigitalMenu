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
          loadMenu(); // menu lsit lao reload gareko
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
          <p><li><b>${dish.name}</li></b> <b>$${price.toFixed(2)}</b></p>
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
          loadMenu(); // menu list lai reload gareko
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
          loadTableStatuses(); // table status la reload gareko
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
        tablesContainer.innerHTML = ""; // aailheko current list lai reload gareko
  
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
        if (data.success) {
          alert(data.message);
          loadTables(); // updated table list lai reload gareko
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
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json();
        })
        .then((tables) => {
            orderList.innerHTML = ""; // kunai pailako order x vane clear gareko

            tables.forEach((table) => {
                const orderDiv = document.createElement("div");

                //per tabels anusar order display gareko
                const orderItems = table.orders.map((orderArray) => {
                    //orderArray chai arryy ho ki haina ra tesma kei items x ki xaina vanera check gareko
                    return orderArray.map((item) => {
                        if (item && item.id !== undefined && item.quantity !== undefined && item.name !== undefined) {
                            return `<li> <b>Item ID:</b>  ${item.id} </li> <li> <b>Quantity:</b> ${item.quantity} </li> </li><b> Dish:</b>${item.name}</li>`;
                        } else {
                            return `<li>Invalid item data</li>`; // yedi invalid data x vane fall back garx back to loop
                        }
                    }).join(""); //order array ko sabbi items lai string ma join garx  
                }).join(""); // table ko lagi sabbai orders join garx 

                orderDiv.innerHTML = `
                    <div class="order-header">
                        <h3>Table ${table.table}</h3>
                        <p class="order-count">Total Orders: ${table.orders.length}</p>
                    </div>
                    <ul class="order-details">
                        ${orderItems}
                    </ul>
                    <div class="order-footer">
                        <p><strong>Total Amount:</strong> $${table.total.toFixed(2)}</p>
                        <button onclick="clearBill(${table.table})" class="btn">Clear Bill</button>
                    </div>
                    <hr class="order-divider">
                `;
                orderList.appendChild(orderDiv);
            });
        })
        .catch((err) => console.error("Error loading orders:", err));
}

// function clearBill(tableNumber) {
//   if (confirm(`Are you sure you want to clear the bill for Table ${tableNumber}?`)) {
//       fetch("php/clearBill.php", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ table_number: tableNumber }),
//       })
//           .then((response) => response.json())
//           .then((data) => {
//               if (data.success) {
//                   alert(`Bill for Table ${tableNumber} has been cleared.`);
//                   loadOrders(); // Refresh the orders list
//               } else {
//                   alert(`Error clearing bill: ${data.message}`);
//               }
//           })
//           .catch((err) => console.error(`Error clearing bill for Table ${tableNumber}:`, err));
//   }
// }


function clearBill(tableNumber) {
  if (confirm(`Are you sure you want to clear the bill for Table ${tableNumber}?`)) {
    fetch("php/clearBill.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_number: tableNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Bill for Table ${tableNumber} has been cleared.`);

          // Update the table status to 'available'
          updateTableStatus(tableNumber, 'available');

          loadOrders(); // Refresh the orders list
        } else {
          alert(`Error clearing bill: ${data.message}`);
        }
      })
      .catch((err) => console.error(`Error clearing bill for Table ${tableNumber}:`, err));
  }
}

  
  // page load garda function initialize gareko
document.addEventListener("DOMContentLoaded", () => {
    loadMenu(); // menu data load garx
    loadTableStatuses(); // table statuses lai load garx
    loadOrders(); // orders load garx
    loadTables(); //table load garx
  });
  