import React from "react";
import { ClothingItem, Outfit } from "../../types/index";
import styles from "./ItemCard.module.css";

interface ClothingCardProps {
  type: 'clothing';
  clothingItem: ClothingItem;
  onSelect: (item: ClothingItem) => void;
}

interface OutfitCardProps {
  type: 'outfit';
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onSelect: (item: Outfit) => void;
}

type ItemCardProps = ClothingCardProps | OutfitCardProps;

export const ItemCard: React.FC<ItemCardProps> = (props) => {
  const handleClick = () => {
    if (props.type === 'clothing') {
      props.onSelect(props.clothingItem);
    } else if (props.type === 'outfit') {
      props.onSelect(props.outfit);
    }
  };

  const getItemName = (itemId: string, clothingItems: ClothingItem[]) => {
    const item = clothingItems.find(item => item.id === itemId);
    return item ? item.name : itemId;
  };

  const getOutfitCover = (outfit: Outfit, clothingItems: ClothingItem[]) => {
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
        return styles.grid1;
      case 2:
        return styles.grid2;
      case 3:
        return styles.grid3;
      case 4:
        return styles.grid4;
      default:
        return styles.grid4;
    }
  };

  if (props.type === 'clothing') {
    const { clothingItem } = props;
    return (
      <div className={styles.itemCard} onClick={handleClick}>
        <div className={styles.itemContent}>
          {clothingItem.imageUrl && (
            <img
              src={`http://localhost:4000${clothingItem.imageUrl}`}
              alt={clothingItem.name}
              className={styles.itemImage}
            />
          )}
          <div className={styles.itemType}>{clothingItem.type}</div>
          <div className={styles.itemName}>{clothingItem.name}</div>
          {clothingItem.color && (
            <div className={styles.itemColor}>{clothingItem.color}</div>
          )}
        </div>
      </div>
    );
  }

  if (props.type === 'outfit') {
    const { outfit, clothingItems } = props;
    const coverItems = getOutfitCover(outfit, clothingItems);
    
    return (
      <div className={styles.itemCard} onClick={handleClick}>
        <div className={styles.itemContent}>
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
                {getItemName(itemId, clothingItems)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}; 