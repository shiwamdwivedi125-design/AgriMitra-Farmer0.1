import { useEffect, useState } from 'react';
import { supabase, type BazaarListing } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Users, Plus, MapPin, Phone, Trash2, X, Loader2, Wheat } from 'lucide-react';

export function BazaarPage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<BazaarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('Quintal');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bazaar_listings').select('*').eq('status', 'active').order('created_at', { ascending: false });
      setListings(data as BazaarListing[] ?? []);
      setLoading(false);
    })();
  }, []);

  async function addListing() {
    if (!user) return;
    setAdding(true);
    const { data } = await supabase.from('bazaar_listings').insert({
      user_id: user.id,
      crop_name: cropName,
      quantity: parseFloat(quantity),
      quantity_unit: quantityUnit,
      price_per_unit: parseFloat(pricePerUnit),
      location,
      description,
    }).select().single();
    if (data) {
      setListings(prev => [data as BazaarListing, ...prev]);
      setCropName(''); setQuantity(''); setPricePerUnit(''); setLocation(''); setDescription('');
      setShowAdd(false);
    }
    setAdding(false);
  }

  async function deleteListing(id: string) {
    await supabase.from('bazaar_listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-7 h-7 text-purple-700" />
              <h1 className="text-3xl font-bold text-gray-900">Kisan Bazaar</h1>
            </div>
            <p className="text-gray-600">Farmer-to-farmer marketplace — sell your harvest directly</p>
          </div>
          {user && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-purple-800 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> List Crop
            </button>
          )}
        </div>

        {/* Add Form */}
        {showAdd && user && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">List Your Crop for Sale</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
                <input type="text" value={cropName} onChange={e => setCropName(e.target.value)} placeholder="Wheat" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="50" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select value={quantityUnit} onChange={e => setQuantityUnit(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                    <option>Quintal</option><option>Kg</option><option>Ton</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per {quantityUnit} (₹)</label>
                <input type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} placeholder="2450" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lucknow, UP" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Freshly harvested, good quality" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            <button
              onClick={addListing}
              disabled={adding || !cropName || !quantity || !pricePerUnit}
              className="mt-4 bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-800 disabled:opacity-50 flex items-center gap-2"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Post Listing
            </button>
          </div>
        )}

        {!user && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-purple-800 text-sm">
              <a href="#/login" className="font-semibold underline">Sign in</a> to list your crops for sale.
            </p>
          </div>
        )}

        {/* Listings */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="bg-gray-200 h-5 rounded w-2/3 mb-3" />
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4" />
                <div className="bg-gray-200 h-10 rounded" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <Wheat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No listings yet</p>
            {user && <p className="text-gray-400 text-sm mt-1">Be the first to list your crop!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
                      <Wheat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{listing.crop_name}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{listing.quality}</span>
                    </div>
                  </div>
                  {user?.id === listing.user_id && (
                    <button onClick={() => deleteListing(listing.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <div className="text-gray-400">Quantity</div>
                    <div className="font-semibold text-gray-900">{listing.quantity} {listing.quantity_unit}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Price</div>
                    <div className="font-semibold text-purple-700">₹{listing.price_per_unit}/{listing.quantity_unit}</div>
                  </div>
                </div>
                {listing.location && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {listing.location}
                  </div>
                )}
                {listing.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
                )}
                {user?.id !== listing.user_id && (
                  <a
                    href={`tel:${profile?.mobile ?? ''}`}
                    className="w-full bg-purple-100 text-purple-700 py-2.5 rounded-xl font-semibold hover:bg-purple-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Phone className="w-4 h-4" /> Contact Farmer
                  </a>
                )}
                {user?.id === listing.user_id && (
                  <div className="text-center text-sm text-gray-400 py-2">Your listing</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
