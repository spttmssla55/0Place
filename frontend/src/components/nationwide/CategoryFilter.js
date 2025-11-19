import React from 'react';
import './CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      <button
        className={selectedCategory === 'all' ? 'category-btn active' : 'category-btn'}
        onClick={() => onCategoryChange('all')}
      >
        전체
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
