import { useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { Calculator, Sprout, Plus, Check, Loader2 } from 'lucide-react';

type PlanItem = {
  name: string;
  quantity: string;
  price: number;
  productId?: string;
};

type CropPlan = {
  crop: string;
  landArea: number;
  landUnit: string;
  season: string;
  soilType: string;
  budget: number;
  items: PlanItem[];
  estimatedCost: number;
};

const cropData: Record<string, {
  season: string;
  seedKgPerKatha: number;
  ureaKgPerKatha: number;
  dapKgPerKatha: number;
  microKgPerKatha: number;
  pesticideBottlesPerKatha: number;
  seedPrice: number;
  ureaPrice: number;
  dapPrice: number;
  microPrice: number;
  pesticidePrice: number;
}> = {
  Wheat: { season: 'Rabi', seedKgPerKatha: 1.6, ureaKgPerKatha: 2, dapKgPerKatha: 1.6, microKgPerKatha: 0.4, pesticideBottlesPerKatha: 0.2, seedPrice: 320, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
  Rice: { season: 'Kharif', seedKgPerKatha: 2, ureaKgPerKatha: 2.5, dapKgPerKatha: 1.5, microKgPerKatha: 0.4, pesticideBottlesPerKatha: 0.3, seedPrice: 280, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
  Mustard: { season: 'Rabi', seedKgPerKatha: 0.4, ureaKgPerKatha: 1, dapKgPerKatha: 1.2, microKgPerKatha: 0.3, pesticideBottlesPerKatha: 0.15, seedPrice: 450, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
  Potato: { season: 'Rabi', seedKgPerKatha: 8, ureaKgPerKatha: 3, dapKgPerKatha: 2, microKgPerKatha: 0.5, pesticideBottlesPerKatha: 0.3, seedPrice: 30, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
  Maize: { season: 'Kharif', seedKgPerKatha: 1.5, ureaKgPerKatha: 2.5, dapKgPerKatha: 1.5, microKgPerKatha: 0.4, pesticideBottlesPerKatha: 0.2, seedPrice: 250, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
  Lentil: { season: 'Rabi', seedKgPerKatha: 1, ureaKgPerKatha: 0.5, dapKgPerKatha: 1, microKgPerKatha: 0.3, pesticideBottlesPerKatha: 0.15, seedPrice: 200, ureaPrice: 270, dapPrice: 1350, microPrice: 600, pesticidePrice: 450 },
};

export function PlannerPage() {
  const { addToCart } = useCart();
  const [landArea, setLandArea] = useState('5');
  const [landUnit, setLandUnit] = useState('Katha');
  const [crop, setCrop] = useState('Wheat');
  const [season, setSeason] = useState('Rabi');
  const [soilType, setSoilType] = useState('Loamy');
  const [budget, setBudget] = useState('10000');
  const [plan, setPlan] = useState<CropPlan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [addingAll, setAddingAll] = useState(false);
  const [addedAll, setAddedAll] = useState(false);

  function generatePlan() {
    const area = parseFloat(landArea) || 0;
    const data = cropData[crop];
    if (!data) return;

    const items: PlanItem[] = [
      { name: `${crop} Seeds`, quantity: `${(data.seedKgPerKatha * area).toFixed(1)} kg`, price: data.seedPrice * data.seedKgPerKatha * area },
      { name: 'Urea Fertilizer', quantity: `${(data.ureaKgPerKatha * area).toFixed(1)} kg`, price: data.ureaPrice * data.ureaKgPerKatha * area },
      { name: 'DAP Fertilizer', quantity: `${(data.dapKgPerKatha * area).toFixed(1)} kg`, price: data.dapPrice * data.dapKgPerKatha * area },
      { name: 'Micronutrient Mix', quantity: `${(data.microKgPerKatha * area).toFixed(1)} kg`, price: data.microPrice * data.microKgPerKatha * area },
      { name: 'Pesticide', quantity: `${Math.ceil(data.pesticideBottlesPerKatha * area)} bottle(s)`, price: data.pesticidePrice * Math.ceil(data.pesticideBottlesPerKatha * area) },
    ];

    const estimatedCost = items.reduce((s, i) => s + i.price, 0);

    setPlan({
      crop,
      landArea: area,
      landUnit,
      season,
      soilType,
      budget: parseFloat(budget) || 0,
      items,
      estimatedCost,
    });
  }

  async function addPlanToCart() {
    setAddingAll(true);
    const { data } = await supabase.from('products').select('*');
    const allProducts = data as Product[] ?? [];
    setProducts(allProducts);

    const findProduct = (keyword: string) => allProducts.find(p => p.name.toLowerCase().includes(keyword.toLowerCase()));

    const seedProduct = findProduct('Seed') && cropData[crop]
      ? allProducts.find(p => p.name.toLowerCase().includes(crop.toLowerCase()) || p.name.toLowerCase().includes('seed'))
      : undefined;
    const ureaProduct = findProduct('Urea');
    const dapProduct = findProduct('DAP');
    const microProduct = findProduct('Micronutrient');
    const pesticideProduct = findProduct('Chlorpyriphos') ?? findProduct('Insecticide');

    const productMap: Record<string, Product | undefined> = {
      [`${crop} Seeds`]: seedProduct,
      'Urea Fertilizer': ureaProduct,
      'DAP Fertilizer': dapProduct,
      'Micronutrient Mix': microProduct,
      'Pesticide': pesticideProduct,
    };

    if (plan) {
      plan.items.forEach(item => {
        const product = productMap[item.name];
        if (product) {
          const qty = parseInt(item.quantity) || 1;
          addToCart(product, qty);
        }
      });
    }
    setAddingAll(false);
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 3000);
  }

  const budgetStatus = plan ? plan.estimatedCost <= plan.budget : false;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-700 rounded-2xl mb-3">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Katha-Based Smart Farm Planner</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your land details and crop — we'll calculate exactly what you need and estimate the total cost.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land Unit</label>
              <select value={landUnit} onChange={(e) => setLandUnit(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                <option>Katha</option><option>Acre</option><option>Bigha</option><option>Hectare</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
              <select value={crop} onChange={(e) => { setCrop(e.target.value); const d = cropData[e.target.value]; if (d) setSeason(d.season); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                {Object.keys(cropData).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                <option>Rabi</option><option>Kharif</option><option>Zaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
              <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                <option>Loamy</option><option>Clay</option><option>Sandy</option><option>Saline</option><option>Alluvial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="10000"
              />
            </div>
          </div>

          <button
            onClick={generatePlan}
            className="w-full mt-6 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" /> Generate Farm Plan
          </button>
        </div>

        {/* Plan Result */}
        {plan && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-700 text-white p-6">
              <div className="flex items-center gap-2 mb-1">
                <Sprout className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{plan.landArea} {plan.landUnit} {plan.crop} Farm Plan</h2>
              </div>
              <p className="text-green-100 text-sm">Season: {plan.season} | Soil: {plan.soilType}</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Required Materials</h3>
              <div className="space-y-3">
                {plan.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">₹{item.price.toFixed(0)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Estimated Total Cost</span>
                  <span className="text-2xl font-bold text-green-700">₹{plan.estimatedCost.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Your Budget: ₹{plan.budget.toLocaleString('en-IN')}</span>
                  <span className={`font-semibold ${budgetStatus ? 'text-green-600' : 'text-red-600'}`}>
                    {budgetStatus ? 'Within Budget ✓' : `Over by ₹${(plan.estimatedCost - plan.budget).toFixed(0)}`}
                  </span>
                </div>
              </div>

              <button
                onClick={addPlanToCart}
                disabled={addingAll || addedAll}
                className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  addedAll ? 'bg-green-600 text-white' : 'bg-amber-500 text-green-900 hover:bg-amber-400'
                }`}
              >
                {addingAll ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Adding...</>
                ) : addedAll ? (
                  <><Check className="w-5 h-5" /> Plan Added to Cart!</>
                ) : (
                  <><Plus className="w-5 h-5" /> Add Complete Plan to Cart</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
