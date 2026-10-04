import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link, navigate } from '@/lib/router';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  async function placeOrder() {
    if (!user || items.length === 0) return;
    setPlacing(true);

    const { data: order } = await supabase.from('orders').insert({
      user_id: user.id,
      total: totalPrice,
      delivery_address: address,
      status: 'pending',
    }).select().single();

    if (order) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      await supabase.from('order_items').insert(orderItems);
      clearCart();
      setSuccess(true);
      setPlacing(false);
      setTimeout(() => navigate('/orders'), 1500);
    } else {
      setPlacing(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Browse the store and add products to your cart</p>
          <Link to="/store" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 inline-flex items-center gap-2">
            Go to Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <img src={item.product.image_url ?? ''} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                  <div className="text-lg font-bold text-green-700 mt-1">₹{item.product.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {user ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} placeholder="Village, District, State - PIN" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={placing || !address}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {placing ? 'Placing...' : 'Place Order'}
                  </button>
                </>
              ) : (
                <Link to="/login" className="block w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 text-center">
                  Sign In to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
