import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useTranslation } from '../hooks/useTranslation';

const SEARCH_DATA = [
  { id: 'about', title: 'About Me', type: 'section', link: '#about' },
  { id: 'contact', title: 'Contact Details', type: 'section', link: '#contact' },
  { id: 'p1', title: 'E-commerce React App', type: 'project', link: '#projects' },
  { id: 's1', title: 'JavaScript & TypeScript', type: 'skill', link: '#skills' },
  { id: 's2', title: 'PHP & MySQL', type: 'skill', link: '#skills' },
];

// ✅ خارج الـ component — لا يُعاد إنشاؤه
const fuse = new Fuse(SEARCH_DATA, {
  keys: ['title', 'type'],
  threshold: 0.3,
});

const SearchModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults([]);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setResults(val ? fuse.search(val) : []);
  };

  const handleNavigate = (link) => {
    setIsOpen(false);
    document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="glass-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-white outline-none placeholder-gray-500 font-mono text-sm"
            placeholder={t('search_placeholder')}
            value={query}
            onChange={handleSearch}
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-64 overflow-y-auto p-2">
            {results.map(({ item }) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.link)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-white flex items-center justify-between transition-colors"
                >
                  <span className="text-sm">{item.title}</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 border border-primary/30 rounded text-primary uppercase tracking-wider font-mono">
                    {item.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="p-6 text-center text-gray-500 font-mono text-sm">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;