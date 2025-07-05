import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/index';
import { updateUserProfile } from '../../api';
import { useTelegramContext } from '../../contexts/TelegramContext';
import styles from './UserProfile.module.css';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onClose,
  onUpdate
}) => {
  const { user: telegramUser, showAlert, showConfirm, hapticSelection } = useTelegramContext();
  const [firstName, setFirstName] = useState(user.firstName || telegramUser?.first_name || '');
  const [lastName, setLastName] = useState(user.lastName || telegramUser?.last_name || '');
  const [username, setUsername] = useState(user.username || telegramUser?.username || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Обновляем превью фото при изменении пользователя
  useEffect(() => {
    if (user.photoUrl) {
      setPhotoPreviewUrl(`http://localhost:4000${user.photoUrl}`);
    } else if (telegramUser?.photo_url) {
      setPhotoPreviewUrl(telegramUser.photo_url);
    } else {
      setPhotoPreviewUrl(null);
    }
  }, [user.photoUrl, telegramUser?.photo_url]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreviewUrl(previewUrl);
      hapticSelection();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await updateUserProfile(
        user.id,
        { firstName, lastName, username },
        photoFile || undefined
      );
      onUpdate(updatedUser);
      await showAlert('Профиль успешно обновлен!');
      onClose();
    } catch (error) {
      console.error(error);
      await showAlert('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (firstName !== user.firstName || lastName !== user.lastName || username !== user.username || photoFile) {
      const confirmed = await showConfirm('У вас есть несохраненные изменения. Вы уверены, что хотите закрыть?');
      if (confirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.modal} ref={modalRef} onClick={handleModalClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className="section-header">Профиль пользователя</h2>
        
        {telegramUser && (
          <div className="telegram-card">
            <h3>Данные Telegram</h3>
            <p><strong>ID:</strong> {telegramUser.id}</p>
            <p><strong>Имя:</strong> {telegramUser.first_name}</p>
            {telegramUser.last_name && <p><strong>Фамилия:</strong> {telegramUser.last_name}</p>}
            {telegramUser.username && <p><strong>Username:</strong> @{telegramUser.username}</p>}
            {telegramUser.is_premium && <p><strong>Premium:</strong> ✅</p>}
            {telegramUser.language_code && <p><strong>Язык:</strong> {telegramUser.language_code}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoSection}>
            <label htmlFor="photo">Фотография профиля:</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="telegram-button"
            />
            {photoPreviewUrl && (
              <div className={styles.photoPreview}>
                <img
                  src={photoPreviewUrl}
                  alt="Превью фото"
                  className={styles.previewImage}
                  onError={(e) => {
                    console.error('Error loading photo preview:', photoPreviewUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="firstName">Имя:</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Введите имя"
              className="telegram-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Фамилия:</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Введите фамилию"
              className="telegram-input"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Никнейм:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите никнейм"
              className="telegram-input"
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={handleCancel} 
              disabled={isLoading}
              className="telegram-button"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="telegram-button"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 