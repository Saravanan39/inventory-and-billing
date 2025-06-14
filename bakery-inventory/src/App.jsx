// updated App.jsx with integrated slide-out menu
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import * as XLSX from "xlsx";
import "./App.css";

// croissant.jpg, muffin.jpg, bagel.jpg, brownie.jpg, cheesecake.jpg,
// cupcake.jpg, eclair.jpg, macaron.jpg, donut.jpg, fruit tart.jpg,
// puff.jpg, paneer roll.jpg, chicken puff.jpg,
// milkshake - vanilla.jpg, milkshake - chocolate.jpg,
// milkshake - strawberry.jpg, hot chocolate.jpg,
// latte.jpg, cappuccino.jpg, espresso.jpg

const mockData = [
  { name: "Croissant", quantity: 30, price: 50, sold: 0, veg: true },
  { name: "Muffin", quantity: 40, price: 30, sold: 0, veg: true },
  { name: "Bagel", quantity: 25, price: 20, sold: 0, veg: true },
  { name: "Brownie", quantity: 35, price: 40, sold: 0, veg: true },
  { name: "Cheesecake", quantity: 20, price: 55, sold: 0, veg: true },
  { name: "Cupcake", quantity: 50, price: 25, sold: 0, veg: true },
  { name: "Eclair", quantity: 28, price: 30, sold: 0, veg: true },
  { name: "Macaron", quantity: 45, price: 40, sold: 0, veg: true },
  { name: "Donut", quantity: 60, price: 30, sold: 0, veg: true },
  { name: "Fruit Tart", quantity: 15, price: 50, sold: 0, veg: true },
  { name: "Puff", quantity: 38, price: 35, sold: 0, veg: true },
  { name: "Paneer Roll", quantity: 20, price: 30, sold: 0, veg: true },
  { name: "Chicken Puff", quantity: 25, price: 40, sold: 0, veg: false },
  { name: "Milkshake - Vanilla", quantity: 30, price: 60, sold: 0, veg: true },
  {
    name: "Milkshake - Chocolate",
    quantity: 32,
    price: 2.7,
    sold: 0,
    veg: true,
  },
  {
    name: "Milkshake - Strawberry",
    quantity: 28,
    price: 2.6,
    sold: 0,
    veg: true,
  },
  { name: "Hot Chocolate", quantity: 20, price: 3.0, sold: 0, veg: true },
  { name: "Latte", quantity: 25, price: 2.5, sold: 0, veg: true },
  { name: "Cappuccino", quantity: 22, price: 2.6, sold: 0, veg: true },
  { name: "Espresso", quantity: 18, price: 2.2, sold: 0, veg: true },
];

function AppHeader({ cartLength, handleImport, resetData, handleExport }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".hamburger") &&
        !e.target.closest(".menu-slideout")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <span style={{ fontWeight: "bold", fontSize: "20px" }}>×</span>
          ) : (
            <>
              <div></div>
              <div></div>
              <div></div>
            </>
          )}
        </div>
        <h1 className="title">Cake carousel</h1>
      </div>
      <div className="header-right">
        <Link to="/cart">
          <button className="button">🛒 {cartLength}</button>
        </Link>
      </div>
      <div className={`menu-slideout ${menuOpen ? "open" : ""}`}>
        <label
          htmlFor="file-upload"
          className="custom-upload"
          onClick={() => setMenuOpen(false)}
        >
          Upload Report
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          className="file-input"
          onChange={handleImport}
        />
        <button
          className="button small"
          onClick={() => {
            resetData();
            setMenuOpen(false);
          }}
        >
          Reset Inventory
        </button>
        <button
          className="button small"
          onClick={() => {
            handleExport();
            setMenuOpen(false);
          }}
        >
          Export Report
        </button>
      </div>
    </header>
  );
}

// function InventoryPage({ addToCart }) {
//   const [search, setSearch] = useState("");
//   const filteredItems = mockData.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <main className="container">
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{
//           marginBottom: "1rem",
//           padding: "0.5rem 1rem",
//           borderRadius: "8px",
//           border: "1px solid #ccc",
//           width: "100%",
//           maxWidth: "400px"
//         }}
//       />
//       <div className="card-grid">
//         {filteredItems.map((item) => (
//           <div key={item.name} className="card">
//             {item.veg ? (
//               <div className="veg-tag"></div>
//             ) : (
//               <div className="veg-tag non-veg-tag"></div>
//             )}
//             <img
//               src={`/${item.name.toLowerCase()}.jpg`}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "/bagel.jpg";
//               }}
//               alt={item.name}
//               className="product-image"
//             />
//             <div className="item-name">{item.name}</div>
//             <div className="details">
//               <span>Total Items: {item.quantity}</span>
//               <span>Sold: {item.sold}</span>
//               <span>Remaining: {item.quantity - item.sold}</span>
//               <span>Price: ${item.price}</span>
//             </div>
//             <div className="add-icon" onClick={() => addToCart(item.name)}>
//               +
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

function InventoryPage({ inventory, addToCart, updateInventory }) {
  const [search, setSearch] = useState("");
  const filteredItems = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (item) => {
    addToCart(item.name);
    updateInventory(item.name);
  };

  return (
    <main className="container">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "400px",
        }}
      />
      <div className="card-grid">
        {filteredItems.map((item) => (
          <div key={item.name} className={`card ${item.quantity - item.sold === 0 ? 'sold-out' : ''}`}>
            {item.veg ? (
              <div className="veg-tag"></div>
            ) : (
              <div className="veg-tag non-veg-tag"></div>
            )}
            <img
              src={`/${item.name.toLowerCase()}.jpg`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/bagel.jpg";
              }}
              alt={item.name}
              className="product-image"
            />
            <div className="item-name">{item.name}</div>
            <div className="details">
              <span>Total Items: {item.quantity}</span>
              <span>Sold: {item.sold}</span>
              <span>Remaining: {item.quantity - item.sold}</span>
              <span>Price: {item.price}</span>
            </div>
            {item.quantity - item.sold > 0 ? (
              <div className="add-icon" onClick={() => handleAdd(item)}>
                +
              </div>
            ) : (
              <div className="sold-banner">Sold Out</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function CartPage({ cart, inventory, clearCart }) {
  const total = cart.reduce((sum, item) => {
    const inv = inventory.find((i) => i.name === item.name);
    return sum + (inv ? inv.price * item.qty : 0);
  }, 0);

  return (
    <main className="container">
      <h1 className="title">Cart Summary</h1>
      <Link to="/">
        <button className="button">← Back</button>
      </Link>
      <ul className="summary-list">
        {cart.map((item) => (
          <li key={item.name}>
            {item.name} x {item.qty}
          </li>
        ))}
      </ul>
      <div className="total">Total: ${total.toFixed(2)}</div>
      <div className="actions">
        <button className="button" onClick={() => window.print()}>
          Print Bill
        </button>
        <button onClick={clearCart} className="button small">
          Clear Cart
        </button>
      </div>
    </main>
  );
}

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);

  const resetData = () => {
    localStorage.removeItem("inventory");

    setInventory(mockData);
    setCart([]);
  };

  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory");
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    else resetData();
  }, []);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(sheet);
      setInventory(importedData);
      setCart([]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const data = inventory.map((item) => {
      const soldItem = cart.find((s) => s.name === item.name);
      const soldQty = soldItem ? soldItem.qty : 0;
      const endQty = item.quantity - soldQty;
      return {
        Name: item.name,
        "Started With": item.quantity,
        Sold: soldQty,
        "Ended With": endQty,
        "Cost/Unit": item.cost,
        "Selling Price": item.price,
        Profit: soldQty * (item.price - item.cost),
      };
    });
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "DayReport");
    XLSX.writeFile(
      workbook,
      `Bakery_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const addToCart = (name) => {
    setCart((prev) => {
      const found = prev.find((item) => item.name === name);
      if (found) {
        return prev.map((item) =>
          item.name === name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name, qty: 1 }];
    });
  };

  const updateInventory = (name) => {
    setInventory((prev) => {
      const found = prev.find((item) => item.name === name);
      if (found) {
        return prev.map((item) =>
          item.name === name ? { ...item, sold: item.sold + 1 } : item
        );
      }
      return [...prev, { name, qty: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <div id="root">
        <AppHeader
          cartLength={cart.length}
          handleImport={handleImport}
          resetData={resetData}
          handleExport={handleExport}
        />
        <Routes>
          <Route
            path="/"
            element={
              <InventoryPage
                inventory={inventory}
                cart={cart}
                addToCart={addToCart}
                updateInventory={updateInventory}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                inventory={inventory}
                clearCart={clearCart}
              />
            }
          />
        </Routes>
        <footer>© 2025 Bakery App. Fueled by sugar and localStorage.</footer>
      </div>
    </BrowserRouter>
  );
}
