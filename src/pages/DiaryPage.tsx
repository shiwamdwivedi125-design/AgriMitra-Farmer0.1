import { useEffect, useState } from 'react';
import { supabase, type FarmDiary } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Plus, Trash2, X, Loader2, TrendingUp, TrendingDown, Sprout, Calendar } from 'lucide-react';

export function DiaryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FarmDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('Rabi');
  const [sowingDate, setSowingDate] = useState('');
  const [landArea, setLandArea] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [pesticide, setPesticide] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('ongoing');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('farm_diary').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setEntries(data as FarmDiary[] ?? []);
      setLoading(false);
    })();
  }, [user]);

  async function addEntry() {
    if (!user || !crop) return;
    setAdding(true);
    const { data } = await supabase.from('farm_diary').insert({
      user_id: user.id,
      crop,
      season,
      sowing_date: sowingDate || null,
      land_area: landArea ? parseFloat(landArea) : null,
      fertilizer_used: fertilizer || null,
      pesticide_used: pesticide || null,
      irrigation_detail: irrigation || null,
      labour_cost: parseFloat(labourCost) || 0,
      total_investment: parseFloat(investment) || 0,
      total_revenue: parseFloat(revenue) || 0,
      notes: notes || null,
      status,
    }).select().single();
    if (data) {
      setEntries(prev => [data as FarmDiary, ...prev]);
      resetForm();
      setShowAdd(false);
    }
    setAdding(false);
  }

  function resetForm() {
    setCrop(''); setSeason('Rabi'); setSowingDate(''); setLandArea('');
    setFertilizer(''); setPesticide(''); setIrrigation(''); setLabourCost('');
    setInvestment(''); setRevenue(''); setNotes(''); setStatus('ongoing');
  }

  async function deleteEntry(id: string) {
    await supabase.from('farm_diary').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  if (!user) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-gray-600">Please sign in to use the farm diary.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-7 h-7 text-teal-700" />
              <h1 className="text-3xl font-bold text-gray-900">Digital Farm Diary</h1>
            </div>
            <p className="text-gray-600">Track every crop cycle — from sowing to harvest</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-teal-800 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New Entry
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">New Farm Diary Entry</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <input type="text" value={crop} onChange={e => setCrop(e.target.value)} placeholder="Wheat" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select value={season} onChange={e => setSeason(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                  <option>Rabi</option><option>Kharif</option><option>Zaid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date</label>
                <input type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
                <input type="number" value={landArea} onChange={e => setLandArea(e.target.value)} placeholder="5" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Used</label>
                <input type="text" value={fertilizer} onChange={e => setFertilizer(e.target.value)} placeholder="Urea 10kg, DAP 8kg" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesticide Used</label>
                <input type="text" value={pesticide} onChange={e => setPesticide(e.target.value)} placeholder="Mancozeb" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Detail</label>
                <input type="text" value={irrigation} onChange={e => setIrrigation(e.target.value)} placeholder="4 rounds, drip" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Labour Cost (₹)</label>
                <input type="number" value={labourCost} onChange={e => setLabourCost(e.target.value)} placeholder="4000" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Investment (₹)</label>
                <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="12000" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Revenue (₹)</label>
                <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="18000" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                  <option value="ongoing">Ongoing</option><option value="harvested">Harvested</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any observations..." className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            </div>
            <button
              onClick={addEntry}
              disabled={adding || !crop}
              className="mt-4 bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-800 disabled:opacity-50 flex items-center gap-2"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Entry
            </button>
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No diary entries yet</p>
            <p className="text-gray-400 text-sm mt-1">Start recording your crop cycle!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => {
              const profit = Number(entry.total_revenue) - Number(entry.total_investment);
              return (
                <div key={entry.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center">
                        <Sprout className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{entry.crop}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{entry.season}</span>
                          {entry.sowing_date && <><span>•</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(entry.sowing_date).toLocaleDateString('en-IN')}</span></>}
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${entry.status === 'harvested' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {entry.status === 'harvested' ? 'Harvested' : 'Ongoing'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                    {entry.fertilizer_used && <div><div className="text-gray-400">Fertilizer</div><div className="font-medium text-gray-700">{entry.fertilizer_used}</div></div>}
                    {entry.pesticide_used && <div><div className="text-gray-400">Pesticide</div><div className="font-medium text-gray-700">{entry.pesticide_used}</div></div>}
                    {entry.irrigation_detail && <div><div className="text-gray-400">Irrigation</div><div className="font-medium text-gray-700">{entry.irrigation_detail}</div></div>}
                    {entry.land_area && <div><div className="text-gray-400">Land</div><div className="font-medium text-gray-700">{entry.land_area} {entry.land_unit}</div></div>}
                  </div>

                  {entry.status === 'harvested' && (Number(entry.total_investment) > 0 || Number(entry.total_revenue) > 0) && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="text-xs text-gray-400">Investment</div>
                          <div className="font-semibold text-gray-900">₹{Number(entry.total_investment).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-xs text-gray-400">Revenue</div>
                          <div className="font-semibold text-gray-900">₹{Number(entry.total_revenue).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="text-xs text-gray-400">Profit</div>
                          <div className={`font-semibold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {entry.notes && <p className="text-sm text-gray-500 mt-3 italic">{entry.notes}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
