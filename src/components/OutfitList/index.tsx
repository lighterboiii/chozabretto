import React from 'react';
import { Outfit, ClothingItem } from '../../types/index';
import styles from './OutfitList.module.css';

interface OutfitListProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onEditOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (outfitId: string) => void;
}

export const OutfitList: React.FC<OutfitListProps> = ({ 
  outfits, 
  clothingItems,
  onEditOutfit,
  onDeleteOutfit 
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
          <div key={outfit.id} className={styles.outfitCard}>
            <div className={styles.outfitHeader}>
              <h3>{outfit.name}</h3>
              <div className={styles.outfitActions}>
                <button onClick={() => onEditOutfit(outfit)}>Редактировать</button>
                <button onClick={() => onDeleteOutfit(outfit.id)}>Удалить</button>
              </div>
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