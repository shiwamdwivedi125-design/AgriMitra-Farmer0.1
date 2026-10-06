import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/lib/router';
import { Sprout, Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState('Katha');
  const [currentCrop, setCurrentCrop] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignup) {
      const { error: err } = await signUp(email, password, {
        full_name: fullName,
        mobile,
        email,
        village,
        district,
        state,
        land_area: landArea ? parseFloat(landArea) : null,
        land_unit: landUnit,
        current_crop: currentCrop || null,
      });
      if (err) {
        const lowerError = err.toLowerCase();
        setError(
          lowerError.includes('weak') || lowerError.includes('easy to guess')
            ? 'This password is weak or commonly exposed. Choose a new, unique passphrase that you have not used on another site.'
            : err
        );
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-700 rounded-2xl mb-3">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isSignup ? 'Create Farmer Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isSignup ? 'Join AgriMitra to manage your farm smarter' : 'Sign in to your AgriMitra account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <InputField icon={User} label="Full Name" value={fullName} onChange={setFullName} required placeholder="Rajesh Kumar" />
                <InputField icon={Phone} label="Mobile Number" value={mobile} onChange={setMobile} required placeholder="9876543210" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={MapPin} label="Village" value={village} onChange={setVillage} required placeholder="Village" />
                  <InputField icon={MapPin} label="District" value={district} onChange={setDistrict} required placeholder="District" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={MapPin} label="State" value={state} onChange={setState} required placeholder="Uttar Pradesh" />
                  <InputField icon={Sprout} label="Current Crop" value={currentCrop} onChange={setCurrentCrop} placeholder="Wheat" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={MapPin} label="Land Area" value={landArea} onChange={setLandArea} type="number" placeholder="5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Unit</label>
                    <select
                      value={landUnit}
                      onChange={(e) => setLandUnit(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    >
                      <option>Katha</option>
                      <option>Acre</option>
                      <option>Bigha</option>
                      <option>Hectare</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <InputField icon={Mail} label="Email" value={email} onChange={setEmail} type="email" required placeholder="farmer@example.com" />
            <InputField icon={Lock} label="Password" value={password} onChange={setPassword} type="password" required placeholder="••••••••" minLength={6} />
            {isSignup && (
              <p className="-mt-3 text-xs text-gray-500">
                Use a new, unique passphrase you have not used on another website.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            {isSignup ? (
              <>Already have an account? <a href="#/login" className="text-green-700 font-semibold hover:underline">Sign In</a></>
            ) : (
              <>New to AgriMitra? <a href="#/signup" className="text-green-700 font-semibold hover:underline">Create Account</a></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  minLength,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
        />
      </div>
    </div>
  );
}
