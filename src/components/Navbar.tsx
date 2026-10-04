import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Link, navigate } from '@/lib/router';
import { Sprout, ShoppingCart, LayoutDashboard, Store, Calculator, Bot, Wrench, Users, BookOpen, LogOut, Menu, X, CloudSun } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', path: '/', icon: Sprout },
  { label: 'Store', path: '/store', icon: Store },
  { label: 'Farm Planner', path: '/planner', icon: Calculator },
  { label: 'AI Assistant', path: '/assistant', icon: Bot },
  { label: 'Equipment', path: '/equipment', icon: Wrench },
  { label: 'Kisan Bazaar', path: '/bazaar', icon: Users },
  { label: 'Farm Diary', path: '/diary', icon: BookOpen },
  { label: 'Weather', path: '/weather', icon: CloudSun },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-green-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
            <Sprout className="w-7 h-7 text-green-400" />
            <span className="hidden sm:inline">AgriMitra</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-1.5"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/cart" className="relative p-2 rounded-lg hover:bg-green-800 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-green-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="hidden md:block text-sm text-green-200 px-2">
                  {profile?.full_name?.split(' ')[0] ?? 'Farmer'}
                </div>
                <button
                  onClick={() => { signOut(); navigate('/'); }}
                  className="p-2 rounded-lg hover:bg-green-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-amber-500 text-green-900 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-400 transition-colors"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-green-950 text-green-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <Sprout className="w-6 h-6 text-green-400" />
              AgriMitra
            </div>
            <p className="text-sm text-green-400">
              AI-powered agriculture marketplace and farm management platform. Plan, purchase, and manage your farm — all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/store" className="hover:text-white">Agriculture Store</Link></li>
              <li><Link to="/planner" className="hover:text-white">Farm Planner</Link></li>
              <li><Link to="/assistant" className="hover:text-white">AI Assistant</Link></li>
              <li><Link to="/equipment" className="hover:text-white">Equipment Rental</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/bazaar" className="hover:text-white">Kisan Bazaar</Link></li>
              <li><Link to="/diary" className="hover:text-white">Farm Diary</Link></li>
              <li><Link to="/weather" className="hover:text-white">Weather Advice</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Farmer Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-6 text-center text-sm text-green-500">
          &copy; 2026 AgriMitra. Empowering farmers with technology.
        </div>
      </div>
    </footer>
  );
}
