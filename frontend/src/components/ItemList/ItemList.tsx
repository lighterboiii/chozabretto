import React from "react";
import { ClothingItem, Outfit } from "../../types/index";
import { ItemCard } from "../ItemCard/ItemCard";
import styles from "./ItemList.module.css";

interface ItemListProps {
  type: 'clothing' | 'outfit';
  clothingItems?: ClothingItem[];
  outfits?: Outfit[];
  onSelectClothing?: (item: ClothingItem) => void;
  onSelectOutfit?: (item: Outfit) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  type,
  clothingItems = [],
  outfits = [],
  onSelectClothing,
  onSelectOutfit,
}) => {
  const handleSelect = (item: ClothingItem | Outfit) => {
    if (type === 'clothing' && onSelectClothing && 'type' in item) {
      onSelectClothing(item as ClothingItem);
    } else if (type === 'outfit' && onSelectOutfit && 'items' in item) {
      onSelectOutfit(item as Outfit);
    }
  };

  if (type === 'clothing') {
    return (
      <div className={styles.itemList}>
        <div className={styles.itemsGrid}>
          {clothingItems.map((item) => (
            <ItemCard
              key={item.id}
              type="clothing"
              clothingItem={item}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'outfit') {
    return (
      <div className={styles.itemList}>
        <div className={styles.itemsGrid}>
          {outfits.map((outfit) => (
            <ItemCard
              key={outfit.id}
              type="outfit"
              outfit={outfit}
              clothingItems={clothingItems}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}; 