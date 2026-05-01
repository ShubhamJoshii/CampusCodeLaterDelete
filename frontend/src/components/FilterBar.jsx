import React from 'react';

const FilterBar = ({ selectedCategory, onFilterChange }) => {
  const topics = ["All", "Array", "DP", "String", "Math", "Stack", "Backtracking", "Linked List"];

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      marginBottom: '24px', 
      overflowX: 'auto', 
      paddingBottom: '8px',
      scrollbarWidth: 'none' 
    }}>
      <span style={{ fontWeight: '600', color: '#4b5563', marginRight: '8px' }}>Topics</span>
      {topics.map((topic) => {
        const isActive = selectedCategory === topic;
        return (
          <button
            key={topic}
            onClick={() => onFilterChange(topic)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: isActive ? '#1f2937' : '#e5e7eb',
              backgroundColor: isActive ? '#1f2937' : '#f9fafb',
              color: isActive ? 'white' : '#4b5563',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
            onMouseOver={(e) => {
              if(!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              if(!isActive) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;