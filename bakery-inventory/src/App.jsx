// React app for frontend-only bakery inventory management
// Uses localStorage and Excel import/export

import React, { useState, useEffect } from "react";
import { Button } from "./UI/Button";
import * as XLSX from "xlsx";

export default function BakeryInventoryApp() {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);

  const resetData = () => {
    localStorage.removeItem("inventory");
    localStorage.removeItem("sales");
    const mockData = [
      { name: "Croissant", quantity: 30, cost: 1.0, price: 2.5 },
      { name: "Muffin", quantity: 40, cost: 0.5, price: 1.75 },
      { name: "Bagel", quantity: 25, cost: 0.8, price: 2.0 },
    ];
    setInventory(mockData);
    setSales([]);
  };

  // Load from localStorage or set mock data on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory");
    const savedSales = localStorage.getItem("sales");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      resetData();
    }
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [inventory, sales]);

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = XLSX.utils.sheet_to_json(sheet);
      setInventory(importedData);
      setSales([]); // Reset sales on new import
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const data = inventory.map((item) => {
      const soldItem = sales.find((s) => s.name === item.name);
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
    XLSX.writeFile(workbook, `Bakery_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleSale = (name) => {
    setSales((prev) => {
      const existing = prev.find((s) => s.name === name);
      if (existing) {
        return prev.map((s) => (s.name === name ? { ...s, qty: s.qty + 1 } : s));
      }
      return [...prev, { name, qty: 1 }];
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bakery Inventory Tracker</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="mb-4" />
      <Button variant="outline" onClick={resetData} className="mb-4 ml-4">Reset Inventory</Button>
      <div className="space-y-4">
        {inventory.map((item) => {
          const sold = sales.find((s) => s.name === item.name)?.qty || 0;
          const remaining = item.quantity - sold;
          return (
            <div key={item.name} className="p-4 border rounded shadow">
              <div className="font-semibold">{item.name}</div>
              <div>Started With: {item.quantity}</div>
              <div>Sold: {sold}</div>
              <div>Remaining: {remaining}</div>
              <Button onClick={() => handleSale(item.name)}>Sell One</Button>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <Button onClick={handleExport}>Export Day Report</Button>
      </div>
    </div>
  );
}
