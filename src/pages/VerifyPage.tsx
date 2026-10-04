import { useState } from 'react';
import { Shield, Search, Check, X, Loader2, Package } from 'lucide-react';

type VerifyResult = {
  product: string;
  brand: string;
  batch: string;
  manufacturing: string;
  expiry: string;
  verified: boolean;
  registered: boolean;
};

export function VerifyPage() {
  const [batchNumber, setBatchNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  async function verify() {
    if (!batchNumber.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise(r => setTimeout(r, 1000));

    // Simulated verification
    const isVerified = batchNumber.length >= 4;
    setResult({
      product: 'XYZ Fertilizer (NPK 20-20-20)',
      brand: 'ABC Agro Sciences',
      batch: batchNumber,
      manufacturing: '08/2026',
      expiry: '08/2028',
      verified: isVerified,
      registered: isVerified,
    });
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-700 rounded-2xl mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Authenticity Verification</h1>
          <p className="text-gray-600">Verify your product batch number or scan QR code to ensure authenticity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Batch Number</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verify()}
                placeholder="e.g., 45892"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={verify}
              disabled={loading || !batchNumber.trim()}
              className="bg-indigo-700 text-white px-5 rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Verify
            </button>
          </div>
        </div>

        {result && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${result.verified ? 'border-green-300' : 'border-red-300'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex items-center gap-3 mb-6 ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
              {result.verified ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
              <div>
                <h3 className="text-xl font-bold">{result.verified ? 'Product Verified' : 'Verification Failed'}</h3>
                <p className="text-sm text-gray-500">{result.verified ? 'This product is authentic and registered' : 'Batch number not found in database'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Product</div>
                  <div className="font-semibold text-gray-900">{result.product}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Brand</div>
                  <div className="font-semibold text-gray-900">{result.brand}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Batch Number</div>
                  <div className="font-semibold text-gray-900">{result.batch}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Manufacturing Date</div>
                  <div className="font-semibold text-gray-900">{result.manufacturing}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Expiry Date</div>
                  <div className="font-semibold text-gray-900">{result.expiry}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                {result.registered ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Batch Registered in System</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">Batch Not Found</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
