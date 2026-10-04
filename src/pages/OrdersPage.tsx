import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { Link } from '@/lib/router';
import { ShoppingBag, Package, Clock, Truck, Check, ChevronRight } from 'lucide-react';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { items?: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: ords } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      const orderList = ords as Order[] ?? [];
      const withItems = await Promise.all(
        orderList.map(async o => {
          const { data: items } = await supabase.from('order_items').select('*').eq('order_id', o.id);
          return { ...o, items: items as OrderItem[] ?? [] };
        })
      );
      setOrders(withItems);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your orders.</p>
          <Link to="/login" className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800">Sign In</Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check },
  ];

  function getStatusIndex(status: string) {
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <Link to="/store" className="text-green-700 font-semibold mt-2 inline-block">Browse Store →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{Number(order.total).toLocaleString('en-IN')}</div>
                      <div className="text-sm text-gray-500">{order.items?.length ?? 0} items</div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-5">
                    {/* Status tracker */}
                    <div className="flex items-center justify-between mb-6 max-w-md">
                      {statusSteps.map((step, i) => {
                        const reached = i <= getStatusIndex(order.status);
                        return (
                          <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${reached ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <step.icon className="w-4 h-4" />
                              </div>
                              <span className={`text-xs mt-1 ${reached ? 'text-green-700 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                            {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < getStatusIndex(order.status) ? 'bg-green-600' : 'bg-gray-200'}`} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                          <div>
                            <span className="font-medium text-gray-900">{item.product_name}</span>
                            <span className="text-gray-500 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {order.delivery_address && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">Delivery Address:</div>
                        <div className="text-sm text-gray-700 mt-1">{order.delivery_address}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
