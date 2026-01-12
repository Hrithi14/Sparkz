const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// --- 1. SETUP & IMPORTS ---
const menuData = require('./menuData');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// App Configuration
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- 2. CONFIGURATION VARIABLES ---
const SERVICE_BUFFER = 30 * 1000;    // 30 Seconds buffer per person
const GRACE_PERIOD = 2 * 60 * 1000;  // 2 Minutes to pick up food

let nextServiceSlot = Date.now();

// --- 3. AUTOMATIC MENU UPLOADER ---
async function seedMenu() {
  const menuRef = db.collection('menu');
  const snapshot = await menuRef.limit(1).get();
  
  if (snapshot.empty) {
    console.log("🌱 Database empty. Uploading Full Menu from menuData.js...");
    menuData.forEach(async (item) => {
      await menuRef.doc(item.id.toString()).set(item);
    });
    console.log("✅ Menu Uploaded Successfully!");
  } else {
    console.log("ℹ️ Menu already exists in Firebase. Skipping upload.");
  }
}
seedMenu();

// --- 4. AUTO-PILOT LOOP (The "Brain") ---
setInterval(async () => {
  const now = Date.now();
  const ordersRef = db.collection('orders');
  
  const snapshot = await ordersRef.where('status', 'in', ['Accepted', 'Ready']).get();

  if (snapshot.empty) return;

  snapshot.forEach(async (doc) => {
    const order = doc.data();
    const orderId = doc.id;

    // RULE A: Mark as READY
    if (order.status === 'Accepted' && now >= order.scheduledReadyTime) {
      await ordersRef.doc(orderId).update({ 
        status: 'Ready',
        pickupDeadline: now + GRACE_PERIOD 
      });
      
      io.emit('order_status_update', { 
        orderId: orderId, 
        status: 'Ready', 
        msg: "Food Ready! Please collect within 2 mins." 
      });
      console.log(`[Firebase] Order ${orderId} is READY.`);
    }

    // RULE B: Mark as HOLDING
    if (order.status === 'Ready' && now > order.pickupDeadline) {
      await ordersRef.doc(orderId).update({ status: 'In Holding' });
      
      io.emit('order_status_update', { 
        orderId: orderId, 
        status: 'In Holding', 
        msg: "⚠️ Grace period over. Moved to Holding Area." 
      });
      console.log(`[Firebase] Order ${orderId} moved to HOLDING.`);
    }
  });
}, 3000);

// --- 5. API ROUTES ---

// GET: Fetch Menu
app.get('/api/menu', (req, res) => {
  res.json(menuData);
});

// POST: Place a New Order
app.post('/api/order', async (req, res) => {
  const { items } = req.body;
  const now = Date.now();
  const orderId = 'ORD-' + now.toString().slice(-6);

  let maxPrepTime = 0;
  items.forEach(cartItem => {
    const menuItem = menuData.find(m => m.id === cartItem.id);
    if (menuItem && menuItem.prepTime > maxPrepTime) {
      maxPrepTime = menuItem.prepTime;
    }
  });
  
  const cookingDuration = (maxPrepTime || 2) * 60 * 1000; 
  const scheduledReadyTime = Math.max(now + cookingDuration, nextServiceSlot);
  nextServiceSlot = scheduledReadyTime + SERVICE_BUFFER;

  const newOrder = {
    orderId,
    items,
    status: 'Accepted',
    scheduledReadyTime,
    pickupDeadline: 0,
    createdAt: now
  };

  await db.collection('orders').doc(orderId).set(newOrder);

  const waitSeconds = Math.ceil((scheduledReadyTime - now) / 1000);
  const waitMsg = `Ready in ${waitSeconds}s`;

  console.log(`[New Order] ${orderId} | Prep: ${maxPrepTime}m | Wait: ${waitSeconds}s`);
  res.json({ success: true, orderId, message: waitMsg });

  setTimeout(() => {
    io.emit('order_status_update', { orderId, status: 'Accepted', prepTime: waitMsg });
  }, 500);
});

// POST: Verify Collection
app.post('/api/verify-collection', async (req, res) => {
  const { orderId } = req.body;
  const now = Date.now();
  
  const orderRef = db.collection('orders').doc(orderId);
  const doc = await orderRef.get();

  if (!doc.exists) return res.json({ success: false, msg: "Order not found" });

  const order = doc.data();

  if (order.status === 'Ready') {
    await orderRef.update({ status: 'Completed' });
    io.emit('order_status_update', { orderId, status: 'Completed' });
    return res.json({ success: true, msg: "Collected on time. Enjoy!" });
  }
  
  if (order.status === 'In Holding') {
    if (now < nextServiceSlot) {
       const extraWait = Math.ceil((nextServiceSlot - now) / 1000);
       nextServiceSlot += SERVICE_BUFFER;
       return res.json({ success: false, msg: `Counter Busy! Please wait ${extraWait}s.` });
    } else {
       await orderRef.update({ status: 'Completed' });
       nextServiceSlot = now + SERVICE_BUFFER;
       io.emit('order_status_update', { orderId, status: 'Completed' });
       return res.json({ success: true, msg: "Collected from Holding!" });
    }
  }

  return res.json({ success: false, msg: "Order not ready yet." });
});

// --- NEW: DASHBOARD STATS API (Added Here) ---
app.get('/api/stats', async (req, res) => {
  try {
    const ordersSnapshot = await db.collection('orders').get();
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let liveOrders = 0;

    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      totalOrders++;
      
      if (order.items) {
        const orderValue = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalRevenue += orderValue;
      }

      if (['Accepted', 'Ready', 'In Holding'].includes(order.status)) {
        liveOrders++;
      }
    });

    const menuSnapshot = await db.collection('menu').get();
    let lowStockCount = 0;
    menuSnapshot.forEach(doc => {
       const item = doc.data();
       if (item.stock !== undefined && item.stock < 10) {
         lowStockCount++;
       }
    });

    res.json({
      totalOrders,
      revenue: totalRevenue,
      liveOrders,
      lowStock: lowStockCount
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- START SERVER ---
server.listen(5000, () => {
  console.log('🔥 FIREBASE SERVER RUNNING on Port 5000');
});