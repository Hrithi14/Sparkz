// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- IMPORT DATABASE ---
// We fetch the menu and orders array from our data.js file
const { menu, orders } = require('./data');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// --- API ROUTES ---

// 1. Get Menu (Fetched from data.js)
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// 2. Place Order
app.post('/api/order', (req, res) => {
  const orderData = req.body;
  const orderId = 'ORD-' + Date.now().toString().slice(-6);

  const newOrder = {
    orderId,
    ...orderData,
    status: 'Pending',
    totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.qty), 0),
    paymentStatus: 'Unpaid'
  };

  // Push to the array imported from data.js
  orders.push(newOrder);

  console.log(`New Order Placed: ${orderId}`);
  
  // --- SIMULATION OF STAFF ACCEPTANCE ---
  setTimeout(() => {
    const prepTime = newOrder.type === 'Pre-order' ? 'As Scheduled' : '15 mins';
    
    // Find the order in our "database" file and update it
    const orderToUpdate = orders.find(o => o.orderId === orderId);
    if (orderToUpdate) {
        orderToUpdate.status = 'Accepted';
        orderToUpdate.prepTime = prepTime;
    }

    io.emit('order_status_update', { 
      orderId: orderId, 
      status: 'Accepted', 
      prepTime: prepTime 
    });
  }, 5000);

  res.json({ success: true, orderId });
});

// 3. Process Payment
app.post('/api/pay', (req, res) => {
  const { orderId, method } = req.body;
  
  // Look up order in data.js array
  const order = orders.find(o => o.orderId === orderId);
  
  if (order) {
    order.paymentStatus = 'Paid';
    order.paymentMethod = method;
    order.status = 'Ready';
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false });
  }
});

server.listen(5000, () => {
  console.log('SERVER RUNNING ON PORT 5000');
});