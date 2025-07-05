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
  fetchOutfitsList,
  createOutfit,
  updateOutfit,
  deleteOutfit,
} from "../../api";
import { CreateOutfitForm } from "../../components/CreateOutfitForm";

export const Home: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [isCreateOutfitFormVisible, setIsCreateOutfitFormVisible] =
    useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);

  // Загрузка данных при старте
  useEffect(() => {
    fetchClothingList().then(setClothingItems).catch(console.error);
    fetchOutfitsList().then(setOutfits).catch(console.error);
  }, []);

  const handleSelectOutfit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setIsCreateOutfitFormVisible(true);
  };



  const handleDeleteOutfitFromForm = async () => {
    if (!editingOutfit) return;
    try {
      await deleteOutfit(editingOutfit.id);
      setOutfits(outfits.filter((outfit) => outfit.id !== editingOutfit.id));
      setEditingOutfit(null);
      setIsCreateOutfitFormVisible(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении набора");
    }
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

  const handleCreateOutfit = async (newOutfit: { name: string; items: string[] }) => {
    try {
      if (editingOutfit) {
        const updated = await updateOutfit(editingOutfit.id, newOutfit);
        setOutfits(
          outfits.map((outfit) =>
            outfit.id === editingOutfit.id ? updated : outfit
          )
        );
        setEditingOutfit(null);
      } else {
        const created = await createOutfit(newOutfit);
        setOutfits([...outfits, created]);
      }
      setIsCreateOutfitFormVisible(false);
    } catch (error) {
      console.error(error);
      alert("Ошибка при сохранении набора");
    }
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
            onSelectOutfit={handleSelectOutfit}
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
          onDelete={editingOutfit ? handleDeleteOutfitFromForm : undefined}
          initialData={editingOutfit || undefined}
        />
      )}
    </div>
  );
};
