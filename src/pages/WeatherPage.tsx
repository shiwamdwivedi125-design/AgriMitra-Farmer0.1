import { CloudSun, Droplets, CloudRain, Thermometer, Wind, AlertTriangle, Sun } from 'lucide-react';

export function WeatherPage() {
  const weather = {
    temp: 29,
    humidity: 65,
    rainChance: 70,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    location: 'Lucknow, Uttar Pradesh',
  };

  const alerts = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Pesticide Spraying Alert',
      message: 'Rain probability is high (70%) today. Avoid spraying pesticides as they may wash off. Consider waiting 1-2 days.',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      iconColor: 'text-amber-600',
    },
    {
      type: 'info',
      icon: Droplets,
      title: 'Irrigation Not Needed',
      message: 'With 70% rain chance, natural irrigation is likely. Skip manual watering today to avoid waterlogging.',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      type: 'success',
      icon: Sun,
      title: 'Good Harvesting Window',
      message: 'Next 3 days show clear weather. Good time for harvesting mature crops.',
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600',
    },
  ];

  const forecast = [
    { day: 'Today', temp: 29, rain: 70, icon: CloudRain },
    { day: 'Tomorrow', temp: 27, rain: 40, icon: CloudSun },
    { day: 'Sat', temp: 30, rain: 10, icon: Sun },
    { day: 'Sun', temp: 31, rain: 5, icon: Sun },
    { day: 'Mon', temp: 28, rain: 30, icon: CloudSun },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-600 rounded-2xl mb-3">
            <CloudSun className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather + Farming Advice</h1>
          <p className="text-gray-600">{weather.location}</p>
        </div>

        {/* Current Weather */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500">Today's Weather</div>
              <div className="text-4xl font-bold text-gray-900">{weather.temp}°C</div>
              <div className="text-gray-600">{weather.condition}</div>
            </div>
            <CloudSun className="w-20 h-20 text-cyan-500" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-cyan-50 rounded-xl p-4 text-center">
              <Thermometer className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.temp}°C</div>
              <div className="text-xs text-gray-500">Temperature</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.humidity}%</div>
              <div className="text-xs text-gray-500">Humidity</div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <CloudRain className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.rainChance}%</div>
              <div className="text-xs text-gray-500">Rain Chance</div>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <Wind className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.windSpeed}</div>
              <div className="text-xs text-gray-500">km/h Wind</div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map(f => (
              <div key={f.day} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{f.day}</div>
                <f.icon className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                <div className="font-bold text-gray-900">{f.temp}°C</div>
                <div className="text-xs text-blue-500">{f.rain}% rain</div>
              </div>
            ))}
          </div>
        </div>

        {/* Farming Alerts */}
        <h3 className="font-bold text-gray-900 mb-4">Farming Alerts & Advice</h3>
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div key={i} className={`rounded-xl border p-5 ${alert.color}`}>
              <div className="flex items-start gap-3">
                <alert.icon className={`w-6 h-6 ${alert.iconColor} shrink-0 mt-0.5`} />
                <div>
                  <h4 className="font-semibold mb-1">{alert.title}</h4>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
