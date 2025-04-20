import React, { useState } from 'react';
import { ClothingList } from '../../components/ClothingList';
import { OutfitList } from '../../components/OutfitList';
import { AddClothingForm } from '../../components/AddClothingForm';
import { mockClothingItems, mockOutfits } from '../../mocks/data';
import { ClothingItem, Outfit } from '../../types';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  const handleEditOutfit = (outfit: Outfit) => {
    // TODO: Implement outfit editing
    console.log('Editing outfit:', outfit);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(outfits.filter(outfit => outfit.id !== outfitId));
  };

  const handleAddClothing = (newItem: Omit<ClothingItem, 'id'>) => {
    const itemWithId: ClothingItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setClothingItems([...clothingItems, itemWithId]);
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Мой гардероб</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.clothingSection}>
          <div className={styles.sectionHeader}>
            <h2>Мои вещи</h2>
            <button 
              className={styles.addButton}
              onClick={() => setIsAddFormVisible(true)}
            >
              + Добавить вещь
            </button>
          </div>
          <ClothingList items={clothingItems} />
        </div>
        <OutfitList 
          outfits={outfits}
          onEditOutfit={handleEditOutfit}
          onDeleteOutfit={handleDeleteOutfit}
        />
      </main>
      {isAddFormVisible && (
        <AddClothingForm
          onSubmit={handleAddClothing}
          onClose={() => setIsAddFormVisible(false)}
        />
      )}
    </div>
  );
}; 