import React, { useState, useEffect } from 'react';
import { ClothingList } from '../../components/ClothingList';
import { AddClothingForm } from '../../components/AddClothingForm';
import { ClothingItem } from '../../types/index';
import styles from './Home.module.css';
import { fetchClothingList, createClothing, updateClothing, deleteClothing } from '../../api';

export const Home: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  // Загрузка данных при старте
  useEffect(() => {
    fetchClothingList()
      .then(setClothingItems)
      .catch(console.error);
  }, []);

  // Добавление или редактирование вещи
  const handleAddClothing = async (newItem: Omit<ClothingItem, 'id'>, imageFile?: File) => {
    try {
      if (editingItem) {
        const updated = await updateClothing(editingItem.id, newItem, imageFile);
        setClothingItems(items => items.map(i => i.id === updated.id ? updated : i));
        setEditingItem(null);
      } else {
        const added = await createClothing(newItem, imageFile);
        setClothingItems(items => [...items, added]);
      }
      setIsAddFormVisible(false);
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении вещи');
    }
  };

  // Выбор вещи для редактирования
  const handleSelectClothingItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsAddFormVisible(true);
  };

  // Удаление вещи
  const handleDeleteClothingItem = async () => {
    if (!editingItem) return;
    try {
      await deleteClothing(editingItem.id);
      setClothingItems(items => items.filter(i => i.id !== editingItem.id));
      setEditingItem(null);
      setIsAddFormVisible(false);
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении вещи');
    }
  };

  const handleCloseForm = () => {
    setIsAddFormVisible(false);
    setEditingItem(null);
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
      </main>
      {isAddFormVisible && (
        <AddClothingForm
          onSubmit={handleAddClothing}
          onClose={handleCloseForm}
          onDelete={editingItem ? handleDeleteClothingItem : undefined}
          initialData={editingItem || undefined}
        />
      )}
    </div>
  );
};
