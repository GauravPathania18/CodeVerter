import React, { useState } from 'react';
import { ArrowRight, Code, Loader2 } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';
import { LANGUAGES, DEFAULT_SOURCE_CODE } from './constants';

const CodeVerter = () => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const convertEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/convert` : '/api/convert';

  const [sourceCode, setSourceCode] = useState(DEFAULT_SOURCE_CODE);
  const [targetCode, setTargetCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('JavaScript');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const convertCode = async () => {
    if (!sourceCode.trim()) {
      setError('Please enter some code to convert');
      return;
    }

    setIsConverting(true);
    setError('');
    setTargetCode('');

    try {
      const response = await fetch(convertEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert code');
      }

      const data = await response.json();
      setTargetCode(data.convertedCode);
    } catch (err) {
      setError(err.message || 'Failed to convert code. Make sure the server is running.');
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <Code className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">CodeVerter</h1>
          <span className="text-gray-400 text-sm ml-2">Programming Language Converter</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Language Selection */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <LanguageDropdown 
              value={sourceLanguage}
              onChange={setSourceLanguage}
              languages={LANGUAGES}
              placeholder="Source Language"
            />
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <LanguageDropdown 
              value={targetLanguage}
              onChange={setTargetLanguage}
              languages={LANGUAGES}
              placeholder="Target Language"
            />
          </div>

          {/* Convert Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={convertCode}
              disabled={isConverting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Convert Code
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Code Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Code Panel */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                <h3 className="font-medium text-gray-200">Source Code ({sourceLanguage})</h3>
              </div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full h-96 p-4 bg-gray-800 text-gray-100 font-mono text-sm resize-none border-none outline-none"
                placeholder="Enter your source code here..."
              />
            </div>

            {/* Target Code Panel */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                <h3 className="font-medium text-gray-200">Converted Code ({targetLanguage})</h3>
              </div>
              <div className="relative">
                <textarea
                  value={targetCode}
                  readOnly
                  className="w-full h-96 p-4 bg-gray-800 text-gray-100 font-mono text-sm resize-none border-none outline-none"
                  placeholder={isConverting ? "Converting..." : "Converted code will appear here..."}
                />
                {isConverting && (
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>CodeVerter uses Google Gemini AI to convert code between programming languages.</p>
            <p className="mt-1">Results may require manual review and adjustment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeVerter;

