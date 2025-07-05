import React from "react";
import { ClothingItem } from "../../types/index";
import styles from "./ClothingList.module.css";

interface ClothingListProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
}

export const ClothingList: React.FC<ClothingListProps> = ({
  items,
  onSelectItem,
}) => {
  return (
    <div className={styles.clothingList}>
      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.clothingItem}
            onClick={() => onSelectItem(item)}
          >
            <div className={styles.itemContent}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div className={styles.itemType}>{item.type}</div>
              <div className={styles.itemName}>{item.name}</div>
              {item.color && (
                <div className={styles.itemColor}>{item.color}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
