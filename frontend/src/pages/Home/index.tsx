import React, { useState, useEffect } from "react";
import { ClothingList } from "../../components/ClothingList";
import { AddClothingForm } from "../../components/AddClothingForm";
import { OutfitList } from "../../components/OutfitList";
import { UserProfile } from "../../components/UserProfile";
import { ClothingItem, Outfit, User } from "../../types/index";
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
  createOrUpdateUser,
} from "../../api";
import { CreateOutfitForm } from "../../components/CreateOutfitForm";
import useTelegram from "../../hooks/useTelegram";

interface HomeProps {
  currentSection: 'clothing' | 'outfits' | 'profile';
}

export const Home: React.FC<HomeProps> = ({ currentSection }) => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [isCreateOutfitFormVisible, setIsCreateOutfitFormVisible] =
    useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const { user: telegramUser, isAvailable: isTelegramAvailable } = useTelegram();

  // Загрузка данных при старте
  useEffect(() => {
    const loadUserData = async () => {
      if (isTelegramAvailable && telegramUser) {
        try {
          // Создаем или обновляем пользователя с данными из Telegram
          const user = await createOrUpdateUser({
            telegramId: telegramUser.id,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            username: telegramUser.username,
            photoUrl: telegramUser.photo_url
          });
          setCurrentUser(user);
        } catch (error) {
          console.error('Ошибка создания/обновления пользователя:', error);
        }
      } else {
        // Fallback для разработки без Telegram
        const mockTelegramId = 172359056;
        try {
          const newUser = await createOrUpdateUser({
            telegramId: mockTelegramId,
            firstName: 'Пользователь',
            username: 'user_' + mockTelegramId,
            photoUrl: currentUser?.photoUrl
          });
          setCurrentUser(newUser);
        } catch (createError) {
          console.error('Ошибка создания пользователя:', createError);
        }
      }
    };

    loadUserData();
    fetchClothingList().then(setClothingItems).catch(console.error);
    fetchOutfitsList().then(setOutfits).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTelegramAvailable, telegramUser]);

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

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'clothing':
        return (
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
        );
      
      case 'outfits':
        return (
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
        );
      
      case 'profile':
        return (
          <div className={styles.profileSection}>
            {currentUser && (
              <div className={styles.userInfo}>
                {currentUser.photoUrl && (
                  <img
                    src={`http://localhost:4000${currentUser.photoUrl}`}
                    alt="Фото профиля"
                    className={styles.userPhoto}
                    onError={(e) => {
                      console.error('Error loading user photo:', currentUser.photoUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span className={styles.userName}>
                  {currentUser.username || 'Пользователь'}
                </span>
                <button
                  className={styles.profileButton}
                  onClick={() => setIsProfileVisible(true)}
                >
                  Редактировать профиль
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Мой гардероб</h1>
        </div>
      </header>
      <main className={styles.main}>
        {renderSection()}
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
      {isProfileVisible && currentUser && (
        <UserProfile
          user={currentUser}
          onClose={() => setIsProfileVisible(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};
