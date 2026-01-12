// server/menuData.js
const menuData = [
    // --- LASSI CORNER (Store: 'lassi') ---
    { id: 1, name: "Mango Lassi", price: 60, prepTime: 2, category: "Lassi & Beverages", store: "lassi", image: "🥭" },
    { id: 2, name: "Black Currant", price: 60, prepTime: 2, category: "Lassi & Beverages", store: "lassi", image: "🫐" },
    { id: 3, name: "Butterscotch", price: 60, prepTime: 2, category: "Lassi & Beverages", store: "lassi", image: "🍦" },
    
    { id: 4, name: "Vanilla Milkshake", price: 40, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🥛" },
    { id: 5, name: "Banana Milkshake", price: 50, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🍌" },
    { id: 6, name: "Oreo Milkshake", price: 50, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🍪" },
    { id: 7, name: "Strawberry", price: 50, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🍓" },
    { id: 8, name: "Black Currant", price: 50, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🫐" },
    { id: 9, name: "Chocolate", price: 60, prepTime: 3, category: "Milkshakes", store: "lassi", image: "🍫" },
  
    { id: 10, name: "Hard Rock Coffee", price: 40, prepTime: 2, category: "Cold Coffee", store: "lassi", image: "☕" },
    { id: 11, name: "BPM Coffee", price: 50, prepTime: 2, category: "Cold Coffee", store: "lassi", image: "☕" },
    { id: 12, name: "Coffee Italia", price: 50, prepTime: 2, category: "Cold Coffee", store: "lassi", image: "☕" },
    { id: 13, name: "Belgian Coffee", price: 60, prepTime: 2, category: "Cold Coffee", store: "lassi", image: "☕" },
  
    { id: 14, name: "Lime Juice", price: 20, prepTime: 2, category: "Juices", store: "lassi", image: "🍋" },
    { id: 15, name: "Mint Lime", price: 30, prepTime: 2, category: "Juices", store: "lassi", image: "🌿" },
    { id: 16, name: "Watermelon", price: 40, prepTime: 2, category: "Juices", store: "lassi", image: "🍉" },
  
    { id: 17, name: "Salted Fries", price: 50, prepTime: 5, category: "French Fries", store: "lassi", image: "🍟" },
    { id: 18, name: "Peri Peri Fries", price: 60, prepTime: 5, category: "French Fries", store: "lassi", image: "🍟" },
    { id: 19, name: "Loaded Fries", price: 150, prepTime: 6, category: "French Fries", store: "lassi", image: "🍟" },
    { id: 20, name: "Sizzler Brownie", price: 150, prepTime: 6, category: "Sizzler Brownie", store: "lassi", image: "🍫" },
  
    // --- CASTLE CAFETERIA (Store: 'castle') ---
    { id: 101, name: "Samosa", price: 20, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🥟", stock: 15 },
    { id: 102, name: "Veg Puff", price: 25, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🥐", stock: 20 },
    { id: 103, name: "Egg Puff", price: 30, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🥐", stock: 12 },
    { id: 104, name: "Chicken Puff", price: 35, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🥐", stock: 10 },
    { id: 105, name: "Masala Bun", price: 20, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🍔", stock: 18 },
    { id: 106, name: "Aloo Bun", price: 20, prepTime: 1, category: "Puffs & Buns", store: "castle", image: "🍔", stock: 16 },
  
    { id: 107, name: "Coffee", price: 15, prepTime: 1, category: "Hot Beverages", store: "castle", image: "☕", stock: 50 },
    { id: 108, name: "Tea", price: 10, prepTime: 1, category: "Hot Beverages", store: "castle", image: "🍵", stock: 50 },
  
    { id: 109, name: "Donut", price: 30, prepTime: 0, category: "Snacks", store: "castle", image: "🍩", stock: 12 },
    { id: 110, name: "Cream Bun", price: 25, prepTime: 0, category: "Snacks", store: "castle", image: "🥐", stock: 14 },
    { id: 111, name: "Cup Noodles", price: 40, prepTime: 2, category: "Snacks", store: "castle", image: "🍜", stock: 8 },
  
    { id: 112, name: "Coca Cola", price: 30, prepTime: 0, category: "Beverages", store: "castle", image: "🥤", stock: 25 },
    { id: 113, name: "Sprite", price: 30, prepTime: 0, category: "Beverages", store: "castle", image: "🥤", stock: 25 },
    { id: 114, name: "Fanta", price: 30, prepTime: 0, category: "Beverages", store: "castle", image: "🥤", stock: 20 },
    { id: 115, name: "Pepsi", price: 30, prepTime: 0, category: "Beverages", store: "castle", image: "🥤", stock: 22 }
  ];
  
  module.exports = menuData;