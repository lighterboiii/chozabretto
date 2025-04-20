import React from 'react';
import { ClothingItem } from '../../types';
import styles from './ClothingList.module.css';

interface ClothingListProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
}

export const ClothingList: React.FC<ClothingListProps> = ({ items, onSelectItem }) => {
  return (
    <div className={styles.clothingList}>
      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <div 
            key={item.id} 
            className={styles.clothingItem}
            onClick={() => onSelectItem(item)}
          >
            <div className={styles.itemType}>{item.type}</div>
            <div className={styles.itemName}>{item.name}</div>
            {item.color && <div className={styles.itemColor}>{item.color}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}; 