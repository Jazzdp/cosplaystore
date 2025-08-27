// SearchBar.jsx - Create this as a separate component
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass search term to parent component
  };

  const searchBarStyle = {
    position: 'relative',
    maxWidth: '400px',
    margin: '20px auto',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '2px solid #f9a8d4',
    borderRadius: '25px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white'
  };

  const iconStyle = {
    position: 'absolute',
    left: '16px',
    color: '#ec4899',
    fontSize: '18px',
    pointerEvents: 'none'
  };

  const clearButtonStyle = {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '18px',
    display: searchTerm ? 'block' : 'none'
  };

  return (
    <div style={searchBarStyle}>
      <span style={iconStyle}>🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        style={{
          ...inputStyle,
          borderColor: searchTerm ? '#ec4899' : '#f9a8d4'
        }}
      />
      {searchTerm && (
        <button 
          style={clearButtonStyle}
          onClick={() => {
            setSearchTerm('');
            onSearch('');
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;