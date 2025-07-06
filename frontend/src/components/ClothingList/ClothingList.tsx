import React from "react";
import { ClothingItem } from "../../types/index";
import { ItemList } from "../ItemList/ItemList";

interface ClothingListProps {
  items: ClothingItem[];
  onSelectItem: (item: ClothingItem) => void;
}

export const ClothingList: React.FC<ClothingListProps> = ({
  items,
  onSelectItem,
}) => {
  return (
    <ItemList
      type="clothing"
      clothingItems={items}
      onSelectClothing={onSelectItem}
    />
  );
};
