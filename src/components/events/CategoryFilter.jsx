import { useState } from 'react';
import { categories } from '../../data/mockData';
import * as Icons from 'lucide-react';

export default function CategoryFilter({ selected, onSelect }) {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = selected === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name === 'All' ? '' : cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              (isActive || (cat.name === 'All' && !selected))
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5'
            }`}
          >
            {getIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
