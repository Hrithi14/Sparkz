import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, Clock, CheckCircle, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { io } from 'socket.io-client';

// ⚙️ CONFIGURATION
// If your server terminal says "Port 5000", keep this.
const BACKEND_URL = 'http://localhost:5000';

// 🔌 Connect to Backend
const socket = io(BACKEND_URL);

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedCafeteria, setSelectedCafeteria] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isManagement, setIsManagement] = useState(false);
  
  // 🆕 REAL DATA STATES (Starts empty, fills from Server)
  const [menuItems, setMenuItems] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ 
    totalOrders: 0, 
    revenue: 0, 
    liveOrders: 0, 
    lowStock: 0 
  });

  // --- 1. INITIAL DATA LOADING ---
  useEffect(() => {
    // Fetch Menu from Server
    fetch(`${BACKEND_URL}/api/menu`)
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error("Menu Load Error:", err));

    // Fetch Dashboard Stats
    fetchStats();
  }, []);

  // --- 2. REAL-TIME LISTENER ---
  useEffect(() => {
    socket.on('order_status_update', (data) => {
      // Update the user's order if they have one
      if (activeOrder && data.orderId === activeOrder.orderId) {
        setActiveOrder(prev => ({ ...prev, ...data }));
      }
      // Update the Manager Dashboard instantly
      fetchStats(); 
    });
    return () => socket.off('order_status_update');
  }, [activeOrder]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/stats`);
      const data = await res.json();
      setDashboardStats(data);
    } catch (err) { console.error("Stats Error:", err); }
  };

  const getCategorizedMenu = (storeName) => {
    const storeItems = menuItems.filter(item => item.store === storeName);
    const categories = {};
    storeItems.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });
    return categories;
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
    else setCart([...cart, {...item, quantity: 1}]);
  };
  
  const removeFromCart = (itemId) => setCart(cart.filter(c => c.id !== itemId));
  const updateQuantity = (itemId, newQty) => newQty === 0 ? removeFromCart(itemId) : setCart(cart.map(c => c.id === itemId ? {...c, quantity: newQty} : c));

  // --- 🔥 SEND ORDER TO SERVER (POST) ---
  const placeOrder = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
      const data = await response.json();
      
      if (data.success) {
        setActiveOrder({ orderId: data.orderId, status: 'Accepted', msg: data.message });
        setCart([]);
        setCurrentView('order-success');
        fetchStats(); // Force refresh stats
      }
    } catch (err) { alert("Server Error. Is backend running?"); }
  };

  const collectOrder = async () => {
    if (!activeOrder) return;
    const response = await fetch(`${BACKEND_URL}/api/verify-collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: activeOrder.orderId })
    });
    const data = await response.json();
    if (data.success) {
      alert(data.msg);
      setActiveOrder(null);
      setCurrentView('landing');
      fetchStats();
    } else { alert(data.msg); }
  };

  // --- VIEWS ---
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Campus Eats</h1>
        <p className="text-gray-600 mb-8">Smart Cafeteria System</p>
        
        {activeOrder && (
          <button onClick={() => setCurrentView('order-success')} className="bg-blue-600 text-white px-6 py-3 rounded-xl mb-6 animate-bounce">
            📍 Track Active Order #{activeOrder.orderId}
          </button>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div onClick={() => {setSelectedCafeteria('lassi'); setCurrentView('lassi-options');}} className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">🥤 Lassi Corner</h2>
            <p className="text-gray-600">Fresh beverages & shakes!</p>
          </div>
          <div onClick={() => {setSelectedCafeteria('castle'); setCurrentView('castle-menu');}} className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-green-600 mb-2">🏰 Castle Cafeteria</h2>
            <p className="text-gray-600">Hot snacks & puffs!</p>
          </div>
        </div>
        
        <button onClick={() => setIsManagement(!isManagement)} className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
            {isManagement ? '👤 Consumer View' : '🔐 Management Portal'}
        </button>
      </div>
    </div>
  );

  // 📊 REAL-TIME DASHBOARD (Uses 'dashboardStats', not hardcoded numbers)
  const ManagementDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📊 Live Kitchen Dashboard</h1>
          <button onClick={() => setIsManagement(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg">Exit to Consumer</button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
            <Users className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Total Orders</p>
            {/* ✨ REAL DATA ✨ */}
            <p className="text-3xl font-bold">{dashboardStats.totalOrders}</p>
          </div>
          <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Total Revenue</p>
            {/* ✨ REAL DATA ✨ */}
            <p className="text-3xl font-bold">₹{dashboardStats.revenue}</p>
          </div>
          <div className="bg-orange-600 text-white rounded-xl p-6 shadow-lg">
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Live Orders</p>
            {/* ✨ REAL DATA ✨ */}
            <p className="text-3xl font-bold">{dashboardStats.liveOrders}</p>
          </div>
          <div className={`text-white rounded-xl p-6 shadow-lg ${dashboardStats.lowStock > 0 ? 'bg-red-600' : 'bg-gray-500'}`}>
            <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-sm opacity-90">Low Stock Items</p>
            {/* ✨ REAL DATA ✨ */}
            <p className="text-3xl font-bold">{dashboardStats.lowStock}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
           <p className="text-gray-500">Waiting for incoming orders...</p>
           <p className="text-xs text-green-600 mt-2">● Connected to Live Server</p>
        </div>
      </div>
    </div>
  );

  const LassiOptions = () => (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <button onClick={() => setCurrentView('landing')} className="mb-4 text-orange-600">← Back</button>
        <h2 className="text-3xl font-bold mb-8">Choose Order Type</h2>
        <div className="grid gap-6">
          <div onClick={() => {setOrderType('pre'); setCurrentView('lassi-menu');}} className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl">
             <h3 className="text-2xl font-bold">⏰ Pre-Order</h3>
          </div>
          <div onClick={() => {setOrderType('spot'); setCurrentView('lassi-menu');}} className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl">
             <h3 className="text-2xl font-bold">⚡ On-Spot</h3>
          </div>
        </div>
      </div>
    </div>
  );

  // Dynamic Menu Component
  const GenericMenu = ({ storeName, title, themeColor, bgColor }) => {
    const categorizedMenu = getCategorizedMenu(storeName);
    
    return (
      <div className={`min-h-screen ${bgColor} p-4`}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setCurrentView(storeName === 'lassi' ? 'lassi-options' : 'landing')} className={`mb-4 ${themeColor}`}>← Back</button>
          <h2 className={`text-2xl font-bold ${themeColor} mb-4`}>{title}</h2>
          
          {Object.keys(categorizedMenu).length === 0 && <p className="text-gray-500 italic">Loading menu...</p>}

          {Object.entries(categorizedMenu).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className={`text-lg font-bold bg-white px-4 py-2 rounded-lg mb-3 inline-block shadow-sm ${themeColor}`}>{category}</h3>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow p-4 min-w-[160px]">
                    <div className="text-4xl text-center mb-2">{item.image}</div>
                    <div className="font-bold text-center">{item.name}</div>
                    <div className={`text-center font-bold ${themeColor}`}>₹{item.price}</div>
                    <button onClick={() => addToCart(item)} className={`w-full mt-2 text-white py-1 rounded ${storeName === 'lassi' ? 'bg-orange-500' : 'bg-green-600'}`}>Add</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {cart.length > 0 && <CartBar />}
        </div>
      </div>
    );
  };

  const CartBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-2xl border-t-4 border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div><p className="font-bold">Cart: {cart.length} items</p><p>Total: ₹{cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</p></div>
        <button onClick={() => setCurrentView('checkout')} className="bg-black text-white px-6 py-3 rounded-lg font-bold">Checkout →</button>
      </div>
    </div>
  );

  const Checkout = () => (
    <div className="min-h-screen bg-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentView('landing')} className="mb-4 text-gray-600">← Back</button>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🛒 Checkout</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span><span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4"><span>Total</span><span>₹{cart.reduce((s,i)=>s+(i.price*i.quantity),0)}</span></div>
          <button onClick={placeOrder} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-orange-600">Confirm & Pay</button>
        </div>
      </div>
    </div>
  );

  const OrderSuccess = () => {
    if (!activeOrder) return <LandingPage />;
    const bgClass = activeOrder.status === 'Ready' ? 'bg-green-50' : activeOrder.status === 'In Holding' ? 'bg-red-50' : 'bg-blue-50';
    const statusColor = activeOrder.status === 'Ready' ? 'text-green-600' : activeOrder.status === 'In Holding' ? 'text-red-600' : 'text-blue-600';

    return (
      <div className={`min-h-screen ${bgClass} p-6 flex items-center justify-center`}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
          <p className="text-gray-500 mb-6">Order ID: #{activeOrder.orderId}</p>
          <div className="mb-8"><div className={`text-4xl font-bold mb-2 ${statusColor}`}>{activeOrder.status}</div><p className="text-lg font-medium">{activeOrder.msg}</p></div>
          {(activeOrder.status === 'Ready' || activeOrder.status === 'In Holding') && (
            <button onClick={collectOrder} className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold">I have collected it 🙋‍♂️</button>
          )}
          <button onClick={() => setCurrentView('landing')} className="mt-4 text-gray-400 text-sm underline">Back to Home</button>
        </div>
      </div>
    );
  };

  if (isManagement) return <ManagementDashboard />;
  if (currentView === 'landing') return <LandingPage />;
  if (currentView === 'lassi-options') return <LassiOptions />;
  if (currentView === 'lassi-menu') return <GenericMenu storeName="lassi" title="🥤 Lassi Corner" themeColor="text-orange-600" bgColor="bg-orange-50" />;
  if (currentView === 'castle-menu') return <GenericMenu storeName="castle" title="🏰 Castle Cafeteria" themeColor="text-green-600" bgColor="bg-green-50" />;
  if (currentView === 'checkout') return <Checkout />;
  if (currentView === 'order-success') return <OrderSuccess />;

  return <LandingPage />;
};

export default App;