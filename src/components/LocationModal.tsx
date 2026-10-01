import React, { useState } from 'react';
import { CityOption } from '../engine/types';
import { TELUGU_CITIES } from '../engine/panchangam';
import { X, MapPin, Check } from 'lucide-react';

interface LocationModalProps {
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
  onClose: () => void;
  language: 'te' | 'en';
}

export const LocationModal: React.FC<LocationModalProps> = ({
  selectedCity,
  onSelectCity,
  onClose,
  language,
}) => {
  const isTe = language === 'te';
  const [customCityName, setCustomCityName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && customCityName.trim()) {
      onSelectCity({
        id: 'custom-' + Date.now(),
        nameTelugu: customCityName,
        nameEnglish: customCityName,
        state: 'Custom',
        latitude: lat,
        longitude: lon,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-telugu animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-900/40 flex items-center justify-between text-amber-200">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {isTe ? 'ప్రాంతం / నగరం ఎంపిక' : 'Select Location'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-slate-400">
            {isTe
              ? 'మీ నగరాన్ని ఎంచుకోండి. దీని ద్వారా సూర్యోదయం, సూర్యాస్తమయం మరియు రాహుకాల సమయాలు సరిగ్గా సరిపోల్చబడతాయి.'
              : 'Choose your city to accurately adjust astronomical sunrise, sunset, and Kalam timings.'}
          </p>

          <div className="space-y-2">
            {TELUGU_CITIES.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500/70 text-amber-200 ring-1 ring-amber-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">
                      {isTe ? city.nameTelugu : city.nameEnglish}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Lat: {city.latitude.toFixed(2)}°, Lon: {city.longitude.toFixed(2)}°
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Coordinates Toggle */}
          <div className="pt-2 border-t border-slate-800">
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors text-center"
              >
                {isTe ? '+ ఇతర ప్రాంతం (Custom Lat/Lon)' : '+ Custom Coordinates (Lat/Lon)'}
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-xs text-amber-300">
                  {isTe ? 'కస్టమ్ స్థానం నమోదు' : 'Enter Custom Coordinates'}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {isTe ? 'నగరం పేరు' : 'City Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customCityName}
                    onChange={(e) => setCustomCityName(e.target.value)}
                    placeholder="e.g. Nellore"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      placeholder="14.44"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={customLon}
                      onChange={(e) => setCustomLon(e.target.value)}
                      placeholder="79.98"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustom(false)}
                    className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300"
                  >
                    {isTe ? 'రద్దు' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-xs font-bold text-slate-950"
                  >
                    {isTe ? 'వర్తించు' : 'Apply'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
