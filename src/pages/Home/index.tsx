import React, { useState } from 'react';
import { ClothingList } from '../../components/ClothingList';
import { OutfitList } from '../../components/OutfitList';
import { mockClothingItems, mockOutfits } from '../../mocks/data';
import { ClothingItem, Outfit } from '../../types';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [clothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);

  const handleEditOutfit = (outfit: Outfit) => {
    // TODO: Implement outfit editing
    console.log('Editing outfit:', outfit);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(outfits.filter(outfit => outfit.id !== outfitId));
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Мой гардероб</h1>
      </header>
      <main className={styles.main}>
        <ClothingList items={clothingItems} />
        <OutfitList 
          outfits={outfits}
          onEditOutfit={handleEditOutfit}
          onDeleteOutfit={handleDeleteOutfit}
        />
      </main>
    </div>
  );
}; 