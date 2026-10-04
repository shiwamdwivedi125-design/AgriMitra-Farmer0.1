import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Expense } from '@/lib/supabase';
import { TrendingDown, Plus, Trash2, TrendingUp, Calculator, Loader2 } from 'lucide-react';

const expenseCategories = ['Seeds', 'Fertilizer', 'Pesticide', 'Labour', 'Irrigation', 'Equipment', 'Transportation', 'Other'];

export function ExpensePage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState('Seeds');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [crop, setCrop] = useState('');
  const [adding, setAdding] = useState(false);

  // Profit calculator
  const [calcCrop, setCalcCrop] = useState('Wheat');
  const [calcInvestment, setCalcInvestment] = useState('');
  const [calcProduction, setCalcProduction] = useState('');
  const [calcPrice, setCalcPrice] = useState('');
  const [profitResult, setProfitResult] = useState<{ revenue: number; profit: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false });
      setExpenses(data as Expense[] ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function addExpense() {
    if (!user || !amount) return;
    setAdding(true);
    const { data } = await supabase.from('expenses').insert({
      user_id: user.id,
      category,
      amount: parseFloat(amount),
      description,
      crop: crop || null,
    }).select().single();
    if (data) {
      setExpenses(prev => [data as Expense, ...prev]);
      setAmount(''); setDescription(''); setCrop('');
      setShowAdd(false);
    }
    setAdding(false);
  }

  async function deleteExpense(id: string) {
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byCategory = expenseCategories.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(c => c.total > 0);

  function calculateProfit() {
    const investment = parseFloat(calcInvestment) || 0;
    const production = parseFloat(calcProduction) || 0;
    const price = parseFloat(calcPrice) || 0;
    const revenue = production * price;
    const profit = revenue - investment;
    setProfitResult({ revenue, profit });
  }

  if (!user) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-600">Please sign in to manage expenses.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Manager</h1>
            <p className="text-gray-600">Track farm expenses and calculate crop profit</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Expense
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-500">Total Expenses</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">₹{totalExpenses.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-2">Expense Entries</div>
            <div className="text-3xl font-bold text-gray-900">{expenses.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-2">Categories Used</div>
            <div className="text-3xl font-bold text-gray-900">{byCategory.length}</div>
          </div>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                  {expenseCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="2000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop (optional)</label>
                <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Wheat" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Bought 10kg urea" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addExpense} disabled={adding || !amount} className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 flex items-center gap-2">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Expense
              </button>
              <button onClick={() => setShowAdd(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {byCategory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Expenses by Category</h3>
            <div className="space-y-3">
              {byCategory.map(({ cat, total }) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="font-semibold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full transition-all" style={{ width: `${(total / totalExpenses) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Recent Expenses</h3>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No expenses recorded yet. Click "Add Expense" to start tracking.</p>
          ) : (
            <div className="space-y-2">
              {expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">
                      {expense.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{expense.category}</div>
                      <div className="text-sm text-gray-500">
                        {expense.crop && `${expense.crop} • `}{expense.description || 'No description'} • {new Date(expense.date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">₹{Number(expense.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => deleteExpense(expense.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profit Calculator */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-green-700" />
            <h3 className="text-xl font-bold text-gray-900">Crop Profit Calculator</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Estimate profit before you harvest</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
              <select value={calcCrop} onChange={(e) => setCalcCrop(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                <option>Wheat</option><option>Rice</option><option>Mustard</option><option>Potato</option><option>Maize</option><option>Lentil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Investment (₹)</label>
              <input type="number" value={calcInvestment} onChange={(e) => setCalcInvestment(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="12000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Production (Quintal)</label>
              <input type="number" value={calcProduction} onChange={(e) => setCalcProduction(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Market Price (₹/Quintal)</label>
              <input type="number" value={calcPrice} onChange={(e) => setCalcPrice(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="2500" />
            </div>
          </div>
          <button onClick={calculateProfit} className="mt-4 bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Calculate Profit
          </button>

          {profitResult && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-600 mb-1">Expected Revenue</div>
                <div className="text-2xl font-bold text-blue-900">₹{profitResult.revenue.toLocaleString('en-IN')}</div>
              </div>
              <div className={`rounded-xl p-4 ${profitResult.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-sm mb-1 ${profitResult.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>Estimated Profit</div>
                <div className={`text-2xl font-bold ${profitResult.profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {profitResult.profit >= 0 ? '+' : ''}₹{profitResult.profit.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
