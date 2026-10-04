import { useState } from 'react';
import { Bot, Send, Loader2, Sprout, AlertCircle, Lightbulb, ShoppingCart, Check, Mic } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase, type Product } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type Diagnosis = {
  possibleIssue: string;
  causes: string[];
  suggestedActions: string[];
  recommendedProducts: { name: string; price: number; reason: string }[];
};

const diagnosisDatabase: Record<string, Diagnosis> = {
  'yellow leaves': {
    possibleIssue: 'Nutrient Deficiency (Nitrogen)',
    causes: ['Insufficient nitrogen in soil', 'Poor fertilizer application', 'Waterlogging causing root damage'],
    suggestedActions: ['Apply urea or nitrogen-rich fertilizer', 'Check soil drainage', 'Consider soil testing for pH levels'],
    recommendedProducts: [
      { name: 'Urea Fertilizer', price: 270, reason: 'Nitrogen-rich fertilizer for yellowing leaves' },
      { name: 'Micronutrient Mix', price: 600, reason: 'Balances micronutrient deficiency' },
    ],
  },
  'pest': {
    possibleIssue: 'Insect Pest Infestation',
    causes: ['Common during warm humid weather', 'Pests like aphids, borers, or caterpillars'],
    suggestedActions: ['Apply appropriate insecticide', 'Inspect crops regularly', 'Remove affected plant parts'],
    recommendedProducts: [
      { name: 'Chlorpyriphos Insecticide', price: 450, reason: 'Broad-spectrum insecticide for pest control' },
      { name: 'Neem Organic Pesticide', price: 350, reason: 'Organic alternative for pest management' },
    ],
  },
  'fungus': {
    possibleIssue: 'Fungal Infection',
    causes: ['High humidity and moisture', 'Poor air circulation between plants', 'Infected seeds or soil'],
    suggestedActions: ['Apply fungicide immediately', 'Improve field drainage', 'Remove infected plants'],
    recommendedProducts: [
      { name: 'Mancozeb Fungicide', price: 380, reason: 'Contact fungicide for fungal disease control' },
    ],
  },
  'weed': {
    possibleIssue: 'Weed Infestation',
    causes: ['Lack of timely weeding', 'Excess moisture promoting weed growth'],
    suggestedActions: ['Manual weeding or use cultivator', 'Apply pre-emergence herbicide', 'Maintain proper plant spacing'],
    recommendedProducts: [
      { name: 'Garden Hoe Tool', price: 450, reason: 'Manual weeding tool' },
    ],
  },
  'drying': {
    possibleIssue: 'Water Stress / Drought',
    causes: ['Insufficient irrigation', 'High temperature and low rainfall', 'Poor soil moisture retention'],
    suggestedActions: ['Increase irrigation frequency', 'Apply mulch to retain moisture', 'Consider drip irrigation'],
    recommendedProducts: [
      { name: 'Drip Irrigation Kit', price: 2500, reason: 'Water-efficient irrigation system' },
      { name: 'Vermicompost', price: 150, reason: 'Improves soil moisture retention' },
    ],
  },
};

export function AssistantPage() {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  async function analyze() {
    if (!query.trim()) return;
    setLoading(true);
    setDiagnosis(null);

    // Simulate AI analysis with keyword matching
    await new Promise(r => setTimeout(r, 1200));

    const lowerQuery = query.toLowerCase();
    let matched: Diagnosis | null = null;

    for (const [keyword, diag] of Object.entries(diagnosisDatabase)) {
      if (lowerQuery.includes(keyword)) {
        matched = diag;
        break;
      }
    }

    if (!matched) {
      matched = {
        possibleIssue: 'General Crop Stress',
        causes: ['Multiple factors could be at play', 'Weather conditions', 'Nutrient imbalance'],
        suggestedActions: ['Conduct a soil test', 'Check irrigation schedule', 'Inspect for pests and diseases', 'Consult local agriculture officer'],
        recommendedProducts: [
          { name: 'Micronutrient Mix', price: 600, reason: 'General nutrient supplement' },
          { name: 'Vermicompost', price: 150, reason: 'Improves overall soil health' },
        ],
      };
    }

    setDiagnosis(matched);
    setHistory(prev => [query, ...prev].slice(0, 5));
    setLoading(false);
  }

  async function handleAddProduct(productName: string, price: number) {
    const { data } = await supabase.from('products').select('*').ilike('name', `%${productName}%%`).limit(1);
    const products = data as Product[] ?? [];
    const product = products[0] ?? { id: productName, name: productName, brand: null, category_id: null, price, stock: 100, rating: 4.0, usage: null, description: null, image_url: null, unit: 'unit' };
    addToCart(product as Product);
    setAddedProducts(prev => new Set([...prev, productName]));
    setTimeout(() => setAddedProducts(prev => { const n = new Set(prev); n.delete(productName); return n; }), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 rounded-2xl mb-3">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Farm Assistant</h1>
          <p className="text-gray-600">Describe your crop problem and get instant diagnosis with product recommendations</p>
        </div>

        {profile?.current_crop && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Sprout className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Farm Context:</strong> Current crop: {profile.current_crop}, Land: {profile.land_area} {profile.land_unit}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
                placeholder="e.g., Mere wheat ke leaves yellow ho rahe hain..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600" />
            </div>
            <button
              onClick={analyze}
              disabled={loading || !query.trim()}
              className="bg-blue-700 text-white px-5 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="hidden sm:inline">{loading ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Yellow leaves', 'Pest attack', 'Fungus on crop', 'Weeds growing', 'Plants drying'].map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Recent Queries</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button key={i} onClick={() => setQuery(h)} className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:border-blue-300">
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your problem...</p>
            <p className="text-sm text-gray-400 mt-1">Checking against crop disease database</p>
          </div>
        )}

        {/* Diagnosis Result */}
        {diagnosis && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Possible Issue */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Possible Issue</h3>
              </div>
              <p className="text-lg font-semibold text-gray-900">{diagnosis.possibleIssue}</p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">Possible Causes:</h4>
                <ul className="space-y-1">
                  {diagnosis.causes.map((cause, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span> {cause}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Suggested Actions</h3>
              </div>
              <ul className="space-y-2">
                {diagnosis.suggestedActions.map((action, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Recommended Products</h3>
              </div>
              <div className="space-y-3">
                {diagnosis.recommendedProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.reason}</div>
                      <div className="text-lg font-bold text-green-700 mt-1">₹{product.price}</div>
                    </div>
                    <button
                      onClick={() => handleAddProduct(product.name, product.price)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                        addedProducts.has(product.name) ? 'bg-green-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {addedProducts.has(product.name) ? <><Check className="w-4 h-4" /> Added</> : <><ShoppingCart className="w-4 h-4" /> Add</>}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 italic">
                Note: This is a possible diagnosis, not a definitive medical/agronomic certainty. For severe issues, consult your local agriculture officer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
