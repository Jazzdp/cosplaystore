import React, { useEffect, useState, useRef } from 'react';
import ItemCard from './itemcard';

export default function SearchOverlay({ isOpen, onClose, initialQuery = '', onQueryChange = () => {} }) {
  const [query, setQuery] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // fetch all products once when opened
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        if (!allProducts) {
          const res = await fetch('http://localhost:8080/products');
          const data = await res.json();
          if (cancelled) return;
          setAllProducts(Array.isArray(data) ? data : []);
          setResults(filterProducts(data, query));
        } else {
          setResults(filterProducts(allProducts, query));
        }
      } catch (err) {
        console.error('Search fetch error', err);
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // debounce query filtering and notify parent of query changes
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      if (allProducts) setResults(filterProducts(allProducts, query));
      try { onQueryChange(query); } catch (e) { /* ignore */ }
    }, 250);
    return () => clearTimeout(t);
  }, [query, isOpen, allProducts, onQueryChange]);

  useEffect(() => { setQuery(initialQuery); }, [initialQuery]);

  function filterProducts(list, q) {
    if (!q || !q.trim()) return list || [];
    const s = q.trim().toLowerCase();
    return (list || []).filter(p => (p.name || '').toLowerCase().includes(s));
  }

  if (!isOpen) return null;

  return (
    <div style={overlayBackdropStyle} onClick={onClose}>
      <div style={overlayStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input
            autoFocus
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={searchInputStyle}
          />
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {loading && <div style={{padding:20}}>Loading results...</div>}

        {!loading && results && results.length === 0 && (
          <div style={{padding:20}}>No products match "{query}"</div>
        )}

        <div style={gridStyle}>
          {results && results.map(p => (
            <div key={p.id} style={{ minWidth: 220 }}>
              <ItemCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const overlayBackdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6vh', zIndex: 9999
};

const overlayStyle = {
  width: 'min(1100px, 96%)', maxHeight: '84vh', overflow: 'auto', background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const searchInputStyle = {
  flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16
};

const closeBtnStyle = { background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer' };

const gridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16
};
