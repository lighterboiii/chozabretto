import React, { useState, useEffect } from "react";
import { ClothingList } from "../../components/ClothingList";
import { AddClothingForm } from "../../components/AddClothingForm";
import { OutfitList } from "../../components/OutfitList";
import { ClothingItem, Outfit } from "../../types/index";
import styles from "./Home.module.css";
import {
  fetchClothingList,
  createClothing,
  updateClothing,
  deleteClothing,
} from "../../api";
import { mockOutfits } from "../../mocks/data";
import { CreateOutfitForm } from "../../components/CreateOutfitForm";

export const Home: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [isCreateOutfitFormVisible, setIsCreateOutfitFormVisible] =
    useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);

  // Загрузка данных при старте
  useEffect(() => {
    fetchClothingList().then(setClothingItems).catch(console.error);
  }, []);

  const handleEditOutfit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setIsCreateOutfitFormVisible(true);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(outfits.filter((outfit) => outfit.id !== outfitId));
  };

  // Добавление или редактирование вещи
  const handleAddClothing = async (
    newItem: Omit<ClothingItem, "id">,
    imageFile?: File
  ) => {
    try {
      if (editingItem) {
        const updated = await updateClothing(
          editingItem.id,
          newItem,
          imageFile
        );
        setClothingItems((items) =>
          items.map((i) => (i.id === updated.id ? updated : i))
        );
        setEditingItem(null);
      } else {
        const added = await createClothing(newItem, imageFile);
        setClothingItems((items) => [...items, added]);
      }
      setIsAddFormVisible(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при сохранении вещи");
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
      setClothingItems((items) => items.filter((i) => i.id !== editingItem.id));
      setEditingItem(null);
      setIsAddFormVisible(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении вещи");
    }
  };

  const handleCloseForm = () => {
    setIsAddFormVisible(false);
    setEditingItem(null);
  };

  const handleCreateOutfit = (newOutfit: { name: string; items: string[] }) => {
    if (editingOutfit) {
      const outfitWithId: Outfit = {
        ...newOutfit,
        id: editingOutfit.id,
        createdAt: editingOutfit.createdAt,
      };
      setOutfits(
        outfits.map((outfit) =>
          outfit.id === editingOutfit.id ? outfitWithId : outfit
        )
      );
      setEditingOutfit(null);
    } else {
      const outfitWithId: Outfit = {
        ...newOutfit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setOutfits([...outfits, outfitWithId]);
    }
    setIsCreateOutfitFormVisible(false);
  };

  const handleCloseOutfitForm = () => {
    setIsCreateOutfitFormVisible(false);
    setEditingOutfit(null);
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
              onClick={() => {
                setEditingOutfit(null);
                setIsCreateOutfitFormVisible(true);
              }}
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
          onClose={handleCloseOutfitForm}
          initialData={editingOutfit || undefined}
        />
      )}
    </div>
  );
};
