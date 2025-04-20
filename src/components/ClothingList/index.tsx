import React from 'react';
import { ClothingItem } from '../../types';
import './ClothingList.module.css';

interface ClothingListProps {
  items: ClothingItem[];
  onSelectItem?: (item: ClothingItem) => void;
}

export const ClothingList: React.FC<ClothingListProps> = ({ items, onSelectItem }) => {
  return (
    <div className="clothing-list">
      <h2>Мои вещи</h2>
      <div className="items-grid">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="clothing-item"
            onClick={() => onSelectItem?.(item)}
          >
            <div className="item-type">{item.type}</div>
            <div className="item-name">{item.name}</div>
            {item.color && <div className="item-color">{item.color}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}; 