import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { useRouter } from '@/lib/router';
import { Navbar, Footer } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { StorePage } from '@/pages/StorePage';
import { PlannerPage } from '@/pages/PlannerPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ExpensePage } from '@/pages/ExpensePage';
import { EquipmentPage } from '@/pages/EquipmentPage';
import { BazaarPage } from '@/pages/BazaarPage';
import { DiaryPage } from '@/pages/DiaryPage';
import { WeatherPage } from '@/pages/WeatherPage';
import { CartPage } from '@/pages/CartPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { VerifyPage } from '@/pages/VerifyPage';
import { Link } from '@/lib/router';

function Router() {
  const route = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading AgriMitra...</p>
        </div>
      </div>
    );
  }

  const protectedRoutes = ['/dashboard', '/expenses', '/diary', '/cart', '/orders'];
  const isProtected = protectedRoutes.some(p => route.path === p || route.path.startsWith(p + '/'));

  let page: React.ReactNode;
  switch (route.path) {
    case '/': page = <HomePage />; break;
    case '/login': page = <AuthPage mode="login" />; break;
    case '/signup': page = <AuthPage mode="signup" />; break;
    case '/dashboard': page = isProtected && !user ? <SignInPrompt /> : <DashboardPage />; break;
    case '/store': page = <StorePage />; break;
    case '/planner': page = <PlannerPage />; break;
    case '/assistant': page = <AssistantPage />; break;
    case '/expenses': page = isProtected && !user ? <SignInPrompt /> : <ExpensePage />; break;
    case '/equipment': page = <EquipmentPage />; break;
    case '/bazaar': page = <BazaarPage />; break;
    case '/diary': page = isProtected && !user ? <SignInPrompt /> : <DiaryPage />; break;
    case '/weather': page = <WeatherPage />; break;
    case '/cart': page = <CartPage />; break;
    case '/orders': page = isProtected && !user ? <SignInPrompt /> : <OrdersPage />; break;
    case '/verify': page = <VerifyPage />; break;
    default: page = <NotFound />; break;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
        <Link to="/login" className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800">Sign In</Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <Link to="/" className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800">Go Home</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
