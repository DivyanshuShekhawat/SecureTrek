import React, { useState } from 'react';
import { Calendar, Clock, Infinity } from 'lucide-react';

interface ExpirationSettingsProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function ExpirationSettings({ value, onChange, className = '' }: ExpirationSettingsProps) {
  const [selectedOption, setSelectedOption] = useState<'1hour' | '1day' | '7days' | '30days' | 'custom'>('7days');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const presetOptions = [
    { id: '1hour', label: '1 Hour', hours: 1 },
    { id: '1day', label: '1 Day', hours: 24 },
    { id: '7days', label: '7 Days', hours: 24 * 7 },
    { id: '30days', label: '30 Days', hours: 24 * 30 },
  ];

  const handlePresetChange = (option: typeof selectedOption) => {
    setSelectedOption(option);
    
    if (option !== 'custom') {
      const preset = presetOptions.find(p => p.id === option);
      if (preset) {
        const newDate = new Date(Date.now() + preset.hours * 60 * 60 * 1000);
        onChange(newDate);
      }
    }
  };

  const handleCustomDateTimeChange = () => {
    if (customDate && customTime) {
      const dateTime = new Date(`${customDate}T${customTime}`);
      if (dateTime > new Date()) {
        onChange(dateTime);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Clock className="w-4 h-4 inline mr-2" />
          Expiration Time
        </label>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {presetOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePresetChange(option.id as any)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedOption === option.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSelectedOption('custom')}
          className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
            selectedOption === 'custom'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Custom Date & Time
        </button>

        {selectedOption === 'custom' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setTimeout(handleCustomDateTimeChange, 100);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
            <input
              type="time"
              value={customTime}
              onChange={(e) => {
                setCustomTime(e.target.value);
                setTimeout(handleCustomDateTimeChange, 100);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Selected Expiration</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {formatDate(value)}
        </p>
      </div>
    </div>
  );
}