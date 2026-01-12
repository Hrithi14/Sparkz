// server/data.js

const menu = [
    { id: 1, name: 'Veg Burger', price: 50 },
    { id: 2, name: 'Chicken Sandwich', price: 80 },
    { id: 3, name: 'Cold Coffee', price: 60 },
    { id: 4, name: 'Masala Dosa', price: 70 }
  ];
  
  // This array acts as our storage for orders
  let orders = [];
  
  // Export them so other files can use them
  module.exports = { menu, orders };