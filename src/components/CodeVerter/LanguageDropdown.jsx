import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LanguageDropdown = ({ value, onChange, languages, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredLanguages = languages.filter(lang =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (language) => {
    onChange(language);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg min-w-48 text-left border border-gray-600"
      >
        <span className="text-gray-200">{value || placeholder}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-600">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search languages..."
              className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded border border-gray-600 text-sm outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors ${
                    value === language ? 'bg-blue-600 text-white' : 'text-gray-200'
                  }`}
                >
                  {language}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

