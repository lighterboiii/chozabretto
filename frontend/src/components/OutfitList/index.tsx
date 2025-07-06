import React from 'react';
import { Outfit, ClothingItem } from '../../types/index';
import { ItemList } from '../ItemList/ItemList';

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
  return (
    <ItemList
      type="outfit"
      outfits={outfits}
      clothingItems={clothingItems}
      onSelectOutfit={onSelectOutfit}
    />
  );
}; 