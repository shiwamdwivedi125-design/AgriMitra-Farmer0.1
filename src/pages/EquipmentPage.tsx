import { useEffect, useState } from 'react';
import { supabase, type Equipment } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Wrench, Calendar, MapPin, Clock, Check, Loader2, X } from 'lucide-react';

export function EquipmentPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingEquip, setBookingEquip] = useState<Equipment | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [duration, setDuration] = useState('1');
  const [location, setLocation] = useState('');
  const [bookingType, setBookingType] = useState<'hour' | 'day'>('hour');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('equipment').select('*').order('name');
      setEquipment(data as Equipment[] ?? []);
      setLoading(false);
    })();
  }, []);

  async function submitBooking() {
    if (!user || !bookingEquip || !bookingDate) return;
    setSubmitting(true);
    const price = bookingType === 'hour'
      ? (bookingEquip.price_per_hour ?? 0) * parseFloat(duration)
      : (bookingEquip.price_per_day ?? 0) * parseFloat(duration);

    await supabase.from('equipment_bookings').insert({
      user_id: user.id,
      equipment_id: bookingEquip.id,
      booking_date: bookingDate,
      duration_hours: parseFloat(duration),
      total_price: price,
      location,
    });
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setBookingEquip(null);
      setBookingDate(''); setDuration('1'); setLocation('');
    }, 2000);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-700 rounded-2xl mb-3">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Rental</h1>
          <p className="text-gray-600">Rent tractors, harvesters, sprayers and more — by the hour or day</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
                <div className="bg-gray-200 rounded-xl w-full h-48 mb-4" />
                <div className="bg-gray-200 h-5 rounded w-2/3 mb-2" />
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4" />
                <div className="bg-gray-200 h-10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map(equip => (
              <div key={equip.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img src={equip.image_url ?? ''} alt={equip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  {!equip.available && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Unavailable</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{equip.name}</h3>
                    {equip.type && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{equip.type}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{equip.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-bold text-orange-700">₹{equip.price_per_hour}/hr</div>
                      <div className="text-xs text-gray-400">₹{equip.price_per_day}/day</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (!user) { window.location.hash = '/login'; return; } setBookingEquip(equip); }}
                    disabled={!equip.available}
                    className="w-full bg-orange-600 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingEquip && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBookingEquip(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Book {bookingEquip.name}</h2>
              <button onClick={() => setBookingEquip(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Booking Confirmed!</h3>
                <p className="text-sm text-gray-500 mt-1">Your equipment has been booked successfully.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBookingType('hour')}
                      className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${bookingType === 'hour' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Per Hour (₹{bookingEquip.price_per_hour})
                    </button>
                    <button
                      onClick={() => setBookingType('day')}
                      className={`flex-1 py-2.5 rounded-lg font-medium text-sm ${bookingType === 'day' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Per Day (₹{bookingEquip.price_per_day})
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration ({bookingType === 'hour' ? 'hours' : 'days'})</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Village, District" className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-2xl font-bold text-orange-700">
                      ₹{(bookingType === 'hour' ? (bookingEquip.price_per_hour ?? 0) : (bookingEquip.price_per_day ?? 0)) * (parseFloat(duration) || 0)}
                    </span>
                  </div>

                  <button
                    onClick={submitBooking}
                    disabled={submitting || !bookingDate}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
