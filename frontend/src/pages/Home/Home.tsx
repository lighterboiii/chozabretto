import React, { useState, useEffect } from "react";
import { ClothingList } from "../../components/ClothingList/ClothingList";
import { AddClothingForm } from "../../components/AddClothingForm/AddClothing";
import { OutfitList } from "../../components/OutfitList";
import { UserProfile } from "../../components/UserProfile/UserProfile";
import { TelegramUserInfo } from "../../components/TelegramUserInfo/TelegramUserInfo";
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
import { CreateOutfitForm } from "../../components/CreateOutfitForm/CreateOutfit";
import { useTelegramContext } from "../../contexts/TelegramContext";

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
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    user: telegramUser, 
    isAvailable: isTelegramAvailable,
    isInTelegram,
    showAlert, 
    showConfirm, 
    hapticSelection,
    hapticNotification 
  } = useTelegramContext();

  console.log('Home: isTelegramAvailable:', isTelegramAvailable);
  console.log('Home: isInTelegram:', isInTelegram);
  console.log('Home: telegramUser:', telegramUser);

  // Загрузка данных при старте
  useEffect(() => {
    // Предотвращаем множественные вызовы
    if (currentUser) {
      console.log('User already exists, skipping creation');
      setIsLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        console.log('Telegram available:', isTelegramAvailable);
        console.log('Telegram user:', telegramUser);
        
        if (isInTelegram && telegramUser) {
          console.log('Creating/updating user with Telegram data:', telegramUser);
          // Создаем или обновляем пользователя с данными из Telegram
          const user = await createOrUpdateUser({
            telegramId: telegramUser.id,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            username: telegramUser.username,
            photoUrl: telegramUser.photo_url
          });
          console.log('User created/updated:', user);
          setCurrentUser(user);
          hapticNotification('success');
        } else {
          console.log('Using fallback user data (development mode)');
          // Fallback для разработки без Telegram
          const mockTelegramId = 172359056;
          const newUser = await createOrUpdateUser({
            telegramId: mockTelegramId,
            firstName: 'Пользователь',
            username: 'user_' + mockTelegramId,
            photoUrl: undefined
          });
          console.log('Fallback user created:', newUser);
          setCurrentUser(newUser);
        }
      } catch (error) {
        console.error('Ошибка создания/обновления пользователя:', error);
        await showAlert('Ошибка при загрузке профиля пользователя');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInTelegram, telegramUser, hapticNotification, showAlert, currentUser]);

  // Загрузка одежды и наборов
  useEffect(() => {
    console.log('Clothing/outfits useEffect triggered');
    console.log('currentUser:', currentUser);
    console.log('currentUser?.telegramId:', currentUser?.telegramId);
    
    if (currentUser?.telegramId) {
      console.log('Loading clothing for user:', currentUser.telegramId);
      fetchClothingList(currentUser.telegramId.toString())
        .then((items) => {
          console.log('Clothing loaded:', items);
          setClothingItems(items);
        })
        .catch(async (error) => {
          console.error('Ошибка загрузки одежды:', error);
          await showAlert('Ошибка при загрузке одежды');
        });
      
      console.log('Loading outfits for user:', currentUser.telegramId);
      fetchOutfitsList(currentUser.telegramId.toString())
        .then((outfits) => {
          console.log('Outfits loaded:', outfits);
          setOutfits(outfits);
        })
        .catch(async (error) => {
          console.error('Ошибка загрузки наборов:', error);
          await showAlert('Ошибка при загрузке наборов');
        });
    } else {
      console.log('No currentUser.telegramId available');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.telegramId, showAlert]);

  const handleSelectOutfit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setIsCreateOutfitFormVisible(true);
    hapticSelection();
  };

  const handleDeleteOutfitFromForm = async () => {
    if (!editingOutfit) return;
    
    const confirmed = await showConfirm('Вы уверены, что хотите удалить этот набор?');
    if (!confirmed) return;
    
    try {
      await deleteOutfit(editingOutfit.id);
      setOutfits(outfits.filter((outfit) => outfit.id !== editingOutfit.id));
      setEditingOutfit(null);
      setIsCreateOutfitFormVisible(false);
      hapticNotification('success');
      await showAlert('Набор успешно удален');
    } catch (error) {
      console.error(error);
      hapticNotification('error');
      await showAlert('Ошибка при удалении набора');
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
        hapticNotification('success');
        await showAlert('Вещь успешно обновлена');
      } else {
        const added = await createClothing(newItem, imageFile, currentUser?.telegramId.toString());
        setClothingItems((items) => [...items, added]);
        hapticNotification('success');
        await showAlert('Вещь успешно добавлена');
      }
      setIsAddFormVisible(false);
    } catch (error) {
      console.error(error);
      hapticNotification('error');
      await showAlert('Ошибка при сохранении вещи');
    }
  };

  // Выбор вещи для редактирования
  const handleSelectClothingItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsAddFormVisible(true);
    hapticSelection();
  };

  // Удаление вещи
  const handleDeleteClothingItem = async () => {
    if (!editingItem) return;
    
    const confirmed = await showConfirm('Вы уверены, что хотите удалить эту вещь?');
    if (!confirmed) return;
    
    try {
      await deleteClothing(editingItem.id);
      setClothingItems((items) => items.filter((i) => i.id !== editingItem.id));
      setEditingItem(null);
      setIsAddFormVisible(false);
      hapticNotification('success');
      await showAlert('Вещь успешно удалена');
    } catch (error) {
      console.error(error);
      hapticNotification('error');
      await showAlert('Ошибка при удалении вещи');
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
        hapticNotification('success');
        await showAlert('Набор успешно обновлен');
      } else {
        const created = await createOutfit(newOutfit, currentUser?.telegramId.toString());
        setOutfits([...outfits, created]);
        hapticNotification('success');
        await showAlert('Набор успешно создан');
      }
      setIsCreateOutfitFormVisible(false);
    } catch (error) {
      console.error(error);
      hapticNotification('error');
      await showAlert('Ошибка при сохранении набора');
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
    if (isLoading) {
      return (
        <div className={styles.loadingSection}>
          <div className={styles.loadingSpinner}></div>
          <p>Загрузка...</p>
        </div>
      );
    }

    switch (currentSection) {
      case 'clothing':
        return (
          <div className={styles.clothingSection}>
            <div className={styles.sectionHeader}>
              <h2 className="section-header">Мои вещи</h2>
              <button
                className="telegram-button"
                onClick={() => {
                  setEditingItem(null);
                  setIsAddFormVisible(true);
                  hapticSelection();
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
              <h2 className="section-header">Мои наборы</h2>
              <button
                className="telegram-button"
                onClick={() => {
                  setEditingOutfit(null);
                  setIsCreateOutfitFormVisible(true);
                  hapticSelection();
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
            <TelegramUserInfo />
            
            {currentUser && (
              <div className="telegram-card">
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
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {currentUser.firstName || currentUser.username || 'Пользователь'}
                    </span>
                    {currentUser.username && (
                      <span className={styles.username}>@{currentUser.username}</span>
                    )}
                  </div>
                </div>
                <button
                  className="telegram-button"
                  onClick={() => {
                    setIsProfileVisible(true);
                    hapticSelection();
                  }}
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
      {/* <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Мой гардероб</h1>
        </div>
      </header> */}
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
