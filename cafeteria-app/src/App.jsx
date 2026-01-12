import React, { useState } from 'react';
import { Coffee, ShoppingBag, Clock, CheckCircle, TrendingUp, Users, AlertCircle } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedCafeteria, setSelectedCafeteria] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [cart, setCart] = useState([]);
  const [isManagement, setIsManagement] = useState(false);

  // Playful quotes
  const playfulQuotes = [
    "Hungry? We've got you covered! 🍔",
    "Food is love, food is life! ❤️",
    "Keep calm and eat on! 🌮",
    "Life happens, coffee helps! ☕",
    "Good food = Good mood! 😊",
    "Eat, drink, and be happy! 🎉",
    "Fuel your brain, feed your belly! 🧠",
    "Snack time is the best time! 🍿"
  ];

  const thankYouMessages = [
    "Thanks for choosing us! You're awesome! 🌟",
    "Yay! Your tummy will thank you! 🎊",
    "Great choice! Enjoy every bite! 😋",
    "You just made our day! Thank you! 💖"
  ];

  // Lassi Corner Menu
  const lassiMenu = {
    "Lassi & Beverages": [
      { id: 1, name: "Mango", price: 60, image: "🥭", available: true, category: "lassi" },
      { id: 2, name: "Black Currant", price: 60, image: "🫐", available: true, category: "lassi" },
      { id: 3, name: "Butterscotch", price: 60, image: "🍦", available: true, category: "lassi" }
    ],
    "Milkshakes": [
      { id: 4, name: "Vanilla", price: 40, image: "🥛", available: true, category: "milkshake" },
      { id: 5, name: "Banana", price: 50, image: "🍌", available: true, category: "milkshake" },
      { id: 6, name: "Oreo", price: 50, image: "🍪", available: true, category: "milkshake" },
      { id: 7, name: "Strawberry", price: 50, image: "🍓", available: true, category: "milkshake" },
      { id: 8, name: "Black Currant", price: 50, image: "🫐", available: true, category: "milkshake" },
      { id: 9, name: "Chocolate", price: 60, image: "🍫", available: true, category: "milkshake" }
    ],
    "Cold Coffee": [
      { id: 10, name: "Hard Rock Coffee (Light)", price: 40, image: "☕", available: true, category: "cold-coffee" },
      { id: 11, name: "BPM Coffee (Strong)", price: 50, image: "☕", available: true, category: "cold-coffee" },
      { id: 12, name: "Coffee Italia", price: 50, image: "☕", available: true, category: "cold-coffee" },
      { id: 13, name: "Belgian Coffee", price: 60, image: "☕", available: true, category: "cold-coffee" }
    ],
    "Juices": [
      { id: 14, name: "Lime Juice", price: 20, image: "🍋", available: true, category: "juice" },
      { id: 15, name: "Mint Lime", price: 30, image: "🌿", available: true, category: "juice" },
      { id: 16, name: "Watermelon", price: 40, image: "🍉", available: true, category: "juice" }
    ],
    "French Fries": [
      { id: 17, name: "Salted Fries", price: 50, image: "🍟", available: true, category: "fries" },
      { id: 18, name: "Peri Peri Fries", price: 60, image: "🍟", available: true, category: "fries" },
      { id: 19, name: "Loaded Fries", price: 150, image: "🍟", available: true, category: "fries" }
    ],
    "Sizzler Brownie": [
      { id: 20, name: "Sizzler Brownie 150g", price: 150, image: "🍫", available: true, category: "dessert" }
    ]
  };

  // Castle Cafeteria Menu
  const castleMenu = {
    "Puffs & Buns": [
      { id: 101, name: "Samosa", price: 20, image: "🥟", available: true, stock: 15 },
      { id: 102, name: "Veg Puff", price: 25, image: "🥐", available: true, stock: 20 },
      { id: 103, name: "Egg Puff", price: 30, image: "🥐", available: true, stock: 12 },
      { id: 104, name: "Chicken Puff", price: 35, image: "🥐", available: true, stock: 10 },
      { id: 105, name: "Masala Bun", price: 20, image: "🍔", available: true, stock: 18 },
      { id: 106, name: "Aloo Bun", price: 20, image: "🍔", available: true, stock: 16 }
    ],
    "Hot Beverages": [
      { id: 107, name: "Coffee", price: 15, image: "☕", available: true, stock: 50 },
      { id: 108, name: "Tea", price: 10, image: "🍵", available: true, stock: 50 }
    ],
    "Snacks": [
      { id: 109, name: "Donut", price: 30, image: "🍩", available: true, stock: 12 },
      { id: 110, name: "Cream Bun", price: 25, image: "🥐", available: true, stock: 14 },
      { id: 111, name: "Cup Noodles", price: 40, image: "🍜", available: true, stock: 8 }
    ],
    "Beverages": [
      { id: 112, name: "Coca Cola", price: 30, image: "🥤", available: true, stock: 25 },
      { id: 113, name: "Sprite", price: 30, image: "🥤", available: true, stock: 25 },
      { id: 114, name: "Fanta", price: 30, image: "🥤", available: true, stock: 20 },
      { id: 115, name: "Pepsi", price: 30, image: "🥤", available: true, stock: 22 }
    ]
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c => c.id === itemId ? {...c, quantity: newQty} : c));
    }
  };

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Campus Eats</h1>
          <p className="text-gray-600">Smart Cafeteria Management System</p>
          <p className="text-orange-600 font-medium mt-2 italic">"{playfulQuotes[Math.floor(Math.random() * playfulQuotes.length)]}"</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div 
            onClick={() => {setSelectedCafeteria('lassi'); setCurrentView('lassi-options');}}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-orange-600">🥤 Lassi Corner</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                🟢 Available
              </span>
            </div>
            <p className="text-gray-600 mb-4">Fresh beverages, shakes & snacks!</p>
            <div className="flex gap-2 text-sm">
              <span className="bg-orange-50 px-3 py-1 rounded-full">Pre-Order ✓</span>
              <span className="bg-orange-50 px-3 py-1 rounded-full">On-Spot ✓</span>
            </div>
          </div>

          <div 
            onClick={() => {setSelectedCafeteria('castle'); setCurrentView('castle-menu');}}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-green-600">🏰 Castle Cafeteria</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                🟢 Available
              </span>
            </div>
            <p className="text-gray-600 mb-4">Hot snacks, puffs & quick bites!</p>
            <div className="flex gap-2 text-sm">
              <span className="bg-yellow-50 px-3 py-1 rounded-full">Walk-in Only</span>
              <span className="bg-green-50 px-3 py-1 rounded-full">Real-time Stock</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsManagement(!isManagement)}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            {isManagement ? '👤 Consumer View' : '🔐 Management Portal'}
          </button>
        </div>
      </div>
    </div>
  );

  // Lassi Corner Options
  const LassiOptions = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentView('landing')} className="mb-4 text-orange-600 hover:text-orange-700">
          ← Back
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-2">🥤 Lassi Corner</h2>
        <p className="text-center text-gray-600 mb-8 italic">Choose your ordering style!</p>

        <div className="grid gap-6">
          <div 
            onClick={() => {setOrderType('pre'); setCurrentView('lassi-menu');}}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Pre-Order</h3>
                <p className="text-gray-600">Schedule your pickup time</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 bg-orange-50 p-3 rounded-lg">
              💡 Perfect for busy schedules! Choose your items and decide when to pick them up.
            </p>
          </div>

          <div 
            onClick={() => {setOrderType('spot'); setCurrentView('lassi-menu');}}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">On-Spot Order</h3>
                <p className="text-gray-600">Order now, get it fresh!</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 bg-green-50 p-3 rounded-lg">
              ⚡ Quick service! Place your order and we'll prepare it right away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Lassi Corner Menu
  const LassiMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setCurrentView('lassi-options')} className="mb-4 text-orange-600">
          ← Back
        </button>
        
        <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <h2 className="text-2xl font-bold text-orange-600 mb-1">🥤 Lassi Corner Menu</h2>
          <p className="text-sm text-gray-600">{orderType === 'pre' ? '📅 Pre-Order Mode' : '⚡ On-Spot Order'}</p>
        </div>

        {Object.entries(lassiMenu).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 bg-orange-100 px-4 py-2 rounded-lg">
              {category}
            </h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4" style={{minWidth: 'min-content'}}>
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-4 min-w-[160px] flex-shrink-0">
                    <div className="text-4xl mb-2 text-center">{item.image}</div>
                    <h4 className="font-semibold text-sm mb-1 text-center">{item.name}</h4>
                    <p className="text-orange-600 font-bold text-center mb-2">₹{item.price}</p>
                    {item.available ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm hover:bg-orange-600 transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm">
                        Sold Out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-4 border-orange-500">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Cart: {cart.length} items</p>
                  <p className="text-orange-600 font-bold">Total: ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
                </div>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-bold"
                >
                  Checkout →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Castle Menu
  const CastleMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setCurrentView('landing')} className="mb-4 text-green-600">
          ← Back
        </button>
        
        <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-1">🏰 Castle Cafeteria</h2>
          <p className="text-sm text-red-600 font-medium">⚠️ Walk-in purchases only • Check availability before visiting</p>
        </div>

        {Object.entries(castleMenu).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 bg-green-100 px-4 py-2 rounded-lg">
              {category}
            </h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4" style={{minWidth: 'min-content'}}>
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-4 min-w-[160px] flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-3xl">{item.image}</div>
                      {item.available ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Sold Out</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-green-600 font-bold mb-1">₹{item.price}</p>
                    <div className="bg-gray-100 rounded-full h-2 mb-1">
                      <div 
                        className={`h-2 rounded-full ${item.stock > 10 ? 'bg-green-500' : item.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{width: `${(item.stock / 30) * 100}%`}}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{item.stock} left</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Management Dashboard
  const ManagementDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📊 Management Dashboard</h1>
          <button onClick={() => setIsManagement(false)} className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            Consumer View
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90">Total Orders Today</p>
            <p className="text-3xl font-bold">247</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90">Revenue Today</p>
            <p className="text-3xl font-bold">₹12.4k</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90">Live Orders</p>
            <p className="text-3xl font-bold">18</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90">Low Stock Items</p>
            <p className="text-3xl font-bold">5</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-orange-600">🥤 Lassi Corner - Top Sellers</h3>
            <div className="space-y-3">
              {[
                {item: "Mango Lassi", sold: 45, trend: "+12%"},
                {item: "Cold Coffee", sold: 38, trend: "+8%"},
                {item: "Chocolate Shake", sold: 32, trend: "+15%"}
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">{item.item}</span>
                  <div className="text-right">
                    <p className="font-bold">{item.sold} sold</p>
                    <p className="text-green-600 text-sm">{item.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">🏰 Castle Cafe - Top Sellers</h3>
            <div className="space-y-3">
              {[
                {item: "Samosa", sold: 67, trend: "+20%"},
                {item: "Veg Puff", sold: 54, trend: "+10%"},
                {item: "Coffee", sold: 89, trend: "+5%"}
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">{item.item}</span>
                  <div className="text-right">
                    <p className="font-bold">{item.sold} sold</p>
                    <p className="text-green-600 text-sm">{item.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">💡 Smart Insights</h3>
          <div className="space-y-2">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="font-medium">⚠️ Chicken Puff stock running low - suggest increasing preparation</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-medium">📈 Mango Lassi demand up 15% - great performance!</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-medium">🕐 Peak hours: 12:00 PM - 2:00 PM (prepare extra stock)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Checkout
  const Checkout = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentView('lassi-menu')} className="mb-4 text-orange-600">
          ← Back to Menu
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4">🛒 Your Order</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-3 pb-3 border-b">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 px-3 py-1 rounded">-</button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 px-3 py-1 rounded">+</button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center text-xl font-bold pt-3">
            <span>Total:</span>
            <span className="text-orange-600">₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
          </div>
        </div>

        {orderType === 'pre' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h3 className="font-bold mb-2">⏰ Select Pickup Time</h3>
            <input type="time" className="w-full border-2 border-orange-300 rounded-lg p-3" />
            <p className="text-sm text-gray-600 mt-2">📞 Contact: +91 98765 43210</p>
          </div>
        )}

        <button
          onClick={() => {
            setCurrentView('order-success');
          }}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition"
        >
          Place Order 🎉
        </button>
      </div>
    </div>
  );

  // Order Success Screen
  const OrderSuccess = () => {
    const orderId = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
    const randomThankYou = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
    const randomQuote = playfulQuotes[Math.floor(Math.random() * playfulQuotes.length)];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform animate-bounce-slow">
            <div className="mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Placed! 🎉</h1>
              <p className="text-xl text-green-600 font-semibold mb-4">{randomThankYou}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
              <p className="text-3xl font-bold text-orange-600 tracking-wider mb-3">#{orderId}</p>
              <div className="bg-white w-32 h-32 mx-auto rounded-xl flex items-center justify-center mb-3">
                <div className="text-6xl">📱</div>
              </div>
              <p className="text-xs text-gray-500">Scan this QR code at pickup</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 italic">"{randomQuote}"</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Coffee className="w-5 h-5 text-orange-500" />
                <span>Your delicious order is being prepared!</span>
              </div>
              {orderType === 'pre' && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Pick up at your scheduled time</span>
                </div>
              )}
              {orderType === 'spot' && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Estimated wait time: 5-10 minutes</span>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <p className="text-lg font-semibold text-gray-700 mb-2">Do visit us again! 💖</p>
              <p className="text-sm text-gray-500 mb-4">We'd love to serve you again soon!</p>
              
              <button
                onClick={() => {
                  setCart([]);
                  setCurrentView('landing');
                  setOrderType(null);
                  setSelectedCafeteria(null);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition"
              >
                Back to Home 🏠
              </button>
            </div>
          </div>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-600">💡 Pro Tip: Take a screenshot of your Order ID!</p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>🍔 Fresh Food</span>
              <span>⚡ Quick Service</span>
              <span>😊 Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render logic
  if (isManagement) return <ManagementDashboard />;
  if (currentView === 'landing') return <LandingPage />;
  if (currentView === 'lassi-options') return <LassiOptions />;
  if (currentView === 'lassi-menu') return <LassiMenu />;
  if (currentView === 'castle-menu') return <CastleMenu />;
  if (currentView === 'checkout') return <Checkout />;
  if (currentView === 'order-success') return <OrderSuccess />;

  return <LandingPage />;
};

export default App;