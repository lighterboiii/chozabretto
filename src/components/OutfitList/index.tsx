import React from 'react';
import { Outfit } from '../../types';
import styles from './OutfitList.module.css';

interface OutfitListProps {
  outfits: Outfit[];
  onEditOutfit?: (outfit: Outfit) => void;
  onDeleteOutfit?: (outfitId: string) => void;
}

export const OutfitList: React.FC<OutfitListProps> = ({ 
  outfits, 
  onEditOutfit, 
  onDeleteOutfit 
}) => {
  return (
    <div className={styles.outfitList}>
      <h2>Мои наборы</h2>
      <div className={styles.outfitsGrid}>
        {outfits.map((outfit) => (
          <div key={outfit.id} className={styles.outfitItem}>
            <h3>{outfit.name}</h3>
            <div className={styles.outfitItems}>
              {outfit.items.map((item) => (
                <div key={item.id} className={styles.outfitClothingItem}>
                  {item.name}
                </div>
              ))}
            </div>
            <div className={styles.outfitActions}>
              <button onClick={() => onEditOutfit?.(outfit)}>Редактировать</button>
              <button onClick={() => onDeleteOutfit?.(outfit.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 