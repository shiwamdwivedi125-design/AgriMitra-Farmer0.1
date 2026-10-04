import { useEffect, useState } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { Link } from '@/lib/router';
import { Search, Star, ShoppingCart, Check, Filter } from 'lucide-react';

export function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').order('name'),
      ]);
      setCategories(cats as Category[] ?? []);
      setProducts(prods as Product[] ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand?.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    return matchSearch && matchCat;
  });

  function handleAdd(product: Product) {
    addToCart(product);
    setAddedIds(prev => new Set([...prev, product.id]));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agriculture Store</h1>
        <p className="text-gray-600 mb-6">Seeds, fertilizers, pesticides, equipment and more</p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or brands..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 shrink-0">
            <Filter className="w-4 h-4" /> Filter:
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg w-full aspect-square mb-3" />
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-200 h-3 rounded w-1/2 mb-3" />
                <div className="bg-gray-200 h-8 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image_url ?? ''}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                    {product.brand && <span className="text-xs text-gray-400 ml-auto">{product.brand}</span>}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.usage}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-700">₹{product.price}</span>
                    <span className="text-xs text-gray-400">/{product.unit}</span>
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={product.stock <= 0}
                    className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      addedIds.has(product.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {addedIds.has(product.id) ? (
                      <><Check className="w-4 h-4" /> Added!</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
