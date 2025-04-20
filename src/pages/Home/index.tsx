import React, { useState } from 'react';
import { ClothingList } from '../../components/ClothingList';
import { OutfitList } from '../../components/OutfitList';
import { AddClothingForm } from '../../components/AddClothingForm';
import { CreateOutfitForm } from '../../components/CreateOutfitForm';
import { mockClothingItems, mockOutfits } from '../../mocks/data';
import { ClothingItem, Outfit } from '../../types/index';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isCreateOutfitFormVisible, setIsCreateOutfitFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const handleEditOutfit = (outfit: Outfit) => {
    // TODO: Implement outfit editing
    console.log('Editing outfit:', outfit);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(outfits.filter(outfit => outfit.id !== outfitId));
  };

  const handleAddClothing = (newItem: Omit<ClothingItem, 'id'>) => {
    if (editingItem) {
      // Редактирование существующей вещи
      setClothingItems(clothingItems.map(item => 
        item.id === editingItem.id 
          ? { ...newItem, id: editingItem.id }
          : item
      ));
      setEditingItem(null);
    } else {
      // Добавление новой вещи
      const itemWithId: ClothingItem = {
        ...newItem,
        id: Date.now().toString(),
      };
      setClothingItems([...clothingItems, itemWithId]);
    }
  };

  const handleSelectClothingItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsAddFormVisible(true);
  };

  const handleDeleteClothingItem = () => {
    if (editingItem) {
      setClothingItems(clothingItems.filter(item => item.id !== editingItem.id));
      setEditingItem(null);
      setIsAddFormVisible(false);
    }
  };

  const handleCloseForm = () => {
    setIsAddFormVisible(false);
    setEditingItem(null);
  };

  const handleCreateOutfit = (newOutfit: { name: string; items: string[] }) => {
    const outfitWithId: Outfit = {
      ...newOutfit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setOutfits([...outfits, outfitWithId]);
    setIsCreateOutfitFormVisible(false);
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
              onClick={() => {
                setEditingItem(null);
                setIsAddFormVisible(true);
              }}
            >
              + Добавить вещь
            </button>
          </div>
          <ClothingList 
            items={clothingItems} 
            onSelectItem={handleSelectClothingItem}
          />
        </div>
        <div className={styles.outfitSection}>
          <div className={styles.sectionHeader}>
            <h2>Мои наборы</h2>
            <button 
              className={styles.addButton}
              onClick={() => setIsCreateOutfitFormVisible(true)}
            >
              + Создать набор
            </button>
          </div>
          <OutfitList 
            outfits={outfits}
            clothingItems={clothingItems}
            onEditOutfit={handleEditOutfit}
            onDeleteOutfit={handleDeleteOutfit}
          />
        </div>
      </main>
      {isAddFormVisible && (
        <AddClothingForm
          onSubmit={handleAddClothing}
          onClose={handleCloseForm}
          onDelete={editingItem ? handleDeleteClothingItem : undefined}
          initialData={editingItem || undefined}
        />
      )}
      {isCreateOutfitFormVisible && (
        <CreateOutfitForm
          clothingItems={clothingItems}
          onSubmit={handleCreateOutfit}
          onClose={() => setIsCreateOutfitFormVisible(false)}
        />
      )}
    </div>
  );
}; 