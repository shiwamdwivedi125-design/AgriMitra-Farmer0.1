import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Expense, type Order, type FarmDiary } from '@/lib/supabase';
import { Link } from '@/lib/router';
import { Sprout, ShoppingCart, Wrench, TrendingDown, BookOpen, Calculator, Bot, Users, ArrowRight, CloudSun } from 'lucide-react';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [diaryCount, setDiaryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: expenses }, { data: orders }, { data: bookings }, { data: diaries }] = await Promise.all([
        supabase.from('expenses').select('amount').eq('user_id', user.id),
        supabase.from('orders').select('id').eq('user_id', user.id),
        supabase.from('equipment_bookings').select('id').eq('user_id', user.id),
        supabase.from('farm_diary').select('id').eq('user_id', user.id),
      ]);
      setExpenseTotal(expenses?.reduce((s, e) => s + Number(e.amount), 0) ?? 0);
      setOrderCount(orders?.length ?? 0);
      setBookingCount(bookings?.length ?? 0);
      setDiaryCount(diaries?.length ?? 0);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your dashboard.</p>
          <Link to="/login" className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800">Sign In</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'My Land', value: `${profile?.land_area ?? '—'} ${profile?.land_unit ?? ''}`, icon: Sprout, color: 'bg-green-100 text-green-700' },
    { label: 'Current Crop', value: profile?.current_crop ?? 'Not set', icon: Sprout, color: 'bg-amber-100 text-amber-700' },
    { label: 'My Orders', value: orderCount, icon: ShoppingCart, color: 'bg-blue-100 text-blue-700' },
    { label: 'Equipment Bookings', value: bookingCount, icon: Wrench, color: 'bg-orange-100 text-orange-700' },
    { label: 'Farm Expenses', value: `₹${expenseTotal.toLocaleString('en-IN')}`, icon: TrendingDown, color: 'bg-rose-100 text-rose-700' },
    { label: 'Farm Diary Entries', value: diaryCount, icon: BookOpen, color: 'bg-teal-100 text-teal-700' },
  ];

  const quickActions = [
    { label: 'Plan Your Farm', desc: 'Katha-based crop planner', path: '/planner', icon: Calculator, color: 'bg-green-700' },
    { label: 'AI Assistant', desc: 'Get crop problem diagnosis', path: '/assistant', icon: Bot, color: 'bg-blue-700' },
    { label: 'Track Expenses', desc: 'Record and analyze costs', path: '/expenses', icon: TrendingDown, color: 'bg-rose-700' },
    { label: 'Kisan Bazaar', desc: 'Sell your harvest', path: '/bazaar', icon: Users, color: 'bg-purple-700' },
    { label: 'Farm Diary', desc: 'Record crop cycle', path: '/diary', icon: BookOpen, color: 'bg-teal-700' },
    { label: 'Weather', desc: 'Today\'s farming advice', path: '/weather', icon: CloudSun, color: 'bg-cyan-700' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-2xl p-6 sm:p-8 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Welcome, {profile?.full_name?.split(' ')[0] ?? 'Farmer'} 👨‍🌾
          </h1>
          <p className="text-green-100">
            {profile?.village}, {profile?.district}, {profile?.state}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-green-300 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{action.label}</h3>
                <p className="text-sm text-gray-500 truncate">{action.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Orders link */}
        <Link
          to="/orders"
          className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all text-center"
        >
          <span className="text-green-700 font-semibold">View All Orders →</span>
        </Link>
      </div>
    </div>
  );
}
