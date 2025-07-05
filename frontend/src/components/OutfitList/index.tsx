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

  const getOutfitCover = (outfit: Outfit) => {
    // Получаем вещи из набора
    const outfitItems = outfit.items
      .map(itemId => clothingItems.find(item => item.id === itemId))
      .filter(item => item && item.imageUrl) // Фильтруем только вещи с картинками
      .slice(0, 4); // Берем максимум 4 картинки

    return outfitItems;
  };

  const getCoverGridClass = (itemCount: number) => {
    switch (itemCount) {
      case 1:
        return styles.coverGrid1;
      case 2:
        return styles.coverGrid2;
      case 3:
        return styles.coverGrid3;
      case 4:
        return styles.coverGrid4;
      default:
        return styles.coverGrid4;
    }
  };

  return (
    <div className={styles.outfitList}>
      <h2>Мои наборы</h2>
      <div className={styles.outfitsGrid}>
        {outfits.map((outfit) => {
          const coverItems = getOutfitCover(outfit);
          return (
            <div 
              key={outfit.id} 
              className={styles.outfitCard}
              onClick={() => onSelectOutfit(outfit)}
            >
              {coverItems.length > 0 && (
                <div className={`${styles.outfitCover} ${getCoverGridClass(coverItems.length)}`}>
                  {coverItems.map((item, index) => (
                    <div key={item!.id} className={styles.coverImage}>
                      <img
                        src={`http://localhost:4000${item!.imageUrl}`}
                        alt={item!.name}
                        className={styles.coverImg}
                      />
                    </div>
                  ))}
                </div>
              )}
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
          );
        })}
      </div>
    </div>
  );
}; 