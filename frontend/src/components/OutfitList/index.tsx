import React from 'react';
import { Outfit, ClothingItem } from '../../types/index';
import styles from './OutfitList.module.css';

interface OutfitListProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onSelectOutfit: (outfit: Outfit) => void;
}

export const OutfitList: React.FC<OutfitListProps> = ({ 
  outfits, 
  clothingItems,
  onSelectOutfit
}) => {
  const getItemName = (itemId: string) => {
    const item = clothingItems.find(item => item.id === itemId);
    return item ? item.name : itemId;
  };

  return (
    <div className={styles.outfitList}>
      <h2>Мои наборы</h2>
      <div className={styles.outfitsGrid}>
        {outfits.map((outfit) => (
          <div 
            key={outfit.id} 
            className={styles.outfitCard}
            onClick={() => onSelectOutfit(outfit)}
          >
            <div className={styles.outfitHeader}>
              <h3>{outfit.name}</h3>
            </div>
            <div className={styles.outfitItems}>
              {outfit.items.map((itemId) => (
                <div key={itemId} className={styles.outfitClothingItem}>
                  {getItemName(itemId)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 