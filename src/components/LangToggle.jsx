// src/components/LangToggle.jsx
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LangToggle = () => {
  const { toggleLang, lang } = useTranslation();

  return (
    <button 
      onClick={toggleLang} 
      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      aria-label="Toggle Language"
    >
      {lang === 'en' ? 'EN | عر' : 'عر | EN'}
    </button>
  );
};

export default LangToggle;