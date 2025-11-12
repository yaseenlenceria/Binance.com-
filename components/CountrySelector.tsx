import React, { useState } from 'react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

const POPULAR_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
];

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (flag: string) => void;
  disabled?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = POPULAR_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (flag: string) => {
    onCountryChange(flag);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="group flex items-center gap-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 hover:from-purple-800/50 hover:to-pink-800/50 text-white px-5 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
        aria-label="Select country"
      >
        <span className="text-3xl">{selectedCountry}</span>
        <div className="flex flex-col items-start">
          <span className="text-xs text-purple-300 font-semibold">Your Country</span>
          <span className="text-sm text-purple-400 group-hover:text-purple-200 transition-colors">Select</span>
        </div>
        <svg className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-3 left-0 bg-gradient-to-br from-indigo-950/95 via-purple-950/95 to-pink-950/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/50 z-50 w-80 max-h-96 overflow-hidden flex flex-col animate-slide-in">
            {/* Search header */}
            <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-indigo-950/50 text-white pl-10 pr-4 py-3 rounded-xl outline-none placeholder-purple-400 border border-purple-500/20 focus:border-purple-400/50 transition-colors font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Countries list */}
            <div className="overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country.flag)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-pink-900/40 text-left transition-all duration-200 text-white group border-b border-purple-500/10 last:border-0"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{country.flag}</span>
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-purple-200 group-hover:text-white transition-colors">{country.name}</span>
                    <p className="text-xs text-purple-500 group-hover:text-purple-400 transition-colors">{country.code}</p>
                  </div>
                  <svg className="w-5 h-5 text-purple-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <svg className="w-12 h-12 text-purple-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-purple-400 font-medium">No countries found</p>
                  <p className="text-purple-600 text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-slide-in {
              animation: slide-in 0.2s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
};
