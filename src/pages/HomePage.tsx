import { Link } from '@/lib/router';
import { Sprout, Store, Calculator, Bot, Wrench, Users, BookOpen, CloudSun, TrendingUp, Shield, ArrowRight, Sprout as Seed } from 'lucide-react';

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://images.pexels.com/photos/20407291/pexels-photo-20407291.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-green-600/40 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sprout className="w-4 h-4 text-green-300" />
              AI-Powered Smart Agriculture Platform
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
              Plan. Purchase. <span className="text-amber-400">Prosper.</span>
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-8 leading-relaxed">
              AgriMitra connects agriculture product purchasing with personalized farm planning.
              Based on your land area, crop, season and budget, we generate a complete farm
              requirement plan, estimate expenses, and help you maximize profits.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/planner"
                className="bg-amber-500 text-green-900 font-semibold px-6 py-3 rounded-xl text-lg hover:bg-amber-400 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                Plan Your Farm <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/store"
                className="bg-white/10 backdrop-blur border border-white/20 font-semibold px-6 py-3 rounded-xl text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
              >
                Browse Store <Store className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Products Available' },
              { value: '1,250+', label: 'Farmers Registered' },
              { value: '6', label: 'Equipment Types' },
              { value: '9', label: 'Product Categories' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold text-green-700">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything Your Farm Needs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From crop planning to equipment rental, AgriMitra brings the entire agricultural
            ecosystem to your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calculator, title: 'Katha-Based Farm Planner', desc: 'Enter your land area, crop, and season. Get a complete requirement plan with estimated costs instantly.', path: '/planner', color: 'bg-green-100 text-green-700' },
            { icon: Store, title: 'Agriculture Store', desc: 'Buy seeds, fertilizers, pesticides, organic products, tools, and more — all in one marketplace.', path: '/store', color: 'bg-amber-100 text-amber-700' },
            { icon: Bot, title: 'AI Farm Assistant', desc: 'Describe your crop problem and get AI-powered diagnosis, suggested actions, and product recommendations.', path: '/assistant', color: 'bg-blue-100 text-blue-700' },
            { icon: Wrench, title: 'Equipment Rental', desc: 'Rent tractors, harvesters, sprayers, and more by the hour or day. No need to buy expensive machinery.', path: '/equipment', color: 'bg-orange-100 text-orange-700' },
            { icon: Users, title: 'Kisan Bazaar', desc: 'Sell your harvest directly to buyers. List your crop, quantity, and price. Farmer-to-farmer marketplace.', path: '/bazaar', color: 'bg-purple-100 text-purple-700' },
            { icon: BookOpen, title: 'Digital Farm Diary', desc: 'Track every crop cycle — from sowing to harvest. Record investments, revenues, and generate farm reports.', path: '/diary', color: 'bg-teal-100 text-teal-700' },
            { icon: TrendingUp, title: 'Expense & Profit Calculator', desc: 'Record farm expenses by category and calculate expected profit before you even plant.', path: '/expenses', color: 'bg-rose-100 text-rose-700' },
            { icon: CloudSun, title: 'Weather + Farming Advice', desc: 'Get real-time weather updates and farming alerts based on local conditions.', path: '/weather', color: 'bg-cyan-100 text-cyan-700' },
            { icon: Shield, title: 'Product Authenticity', desc: 'Verify product batches and QR codes to ensure you buy genuine, quality agriculture inputs.', path: '/verify', color: 'bg-indigo-100 text-indigo-700' },
          ].map((feature) => (
            <Link
              key={feature.title}
              to={feature.path}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-green-300 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              <div className="mt-4 text-sm font-semibold text-green-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How AgriMitra Works</h2>
            <p className="text-lg text-gray-600">From land to profit in 5 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Register', desc: 'Create your farmer account with land details', icon: Seed },
              { step: '2', title: 'Plan', desc: 'Use Katha-based planner for your crop', icon: Calculator },
              { step: '3', title: 'Purchase', desc: 'Buy required products from the store', icon: Store },
              { step: '4', title: 'Manage', desc: 'Track expenses, diary, and get AI advice', icon: Bot },
              { step: '5', title: 'Profit', desc: 'Calculate returns and sell at Kisan Bazaar', icon: TrendingUp },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="relative mx-auto w-16 h-16 bg-green-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <s.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-green-900 text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-800 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-lg text-green-100 mb-8">
            Join thousands of farmers using AgriMitra to plan smarter, buy better, and earn more.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="bg-amber-500 text-green-900 font-semibold px-8 py-3 rounded-xl text-lg hover:bg-amber-400 transition-all hover:scale-105">
              Get Started Free
            </Link>
            <Link to="/planner" className="bg-white/10 backdrop-blur border border-white/20 font-semibold px-8 py-3 rounded-xl text-lg hover:bg-white/20 transition-all">
              Try Farm Planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
