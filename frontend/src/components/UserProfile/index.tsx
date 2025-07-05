import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/index';
import { updateUserProfile } from '../../api';
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
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [username, setUsername] = useState(user.username || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(user.photoUrl ? `http://localhost:4000${user.photoUrl}` : null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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
      onClose();
    } catch (error) {
      console.error(error);
      alert('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modal} ref={modalRef} onClick={handleModalClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Профиль пользователя</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoSection}>
            <label htmlFor="photo">Фотография профиля:</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreviewUrl && (
              <div className={styles.photoPreview}>
                <img
                  src={photoPreviewUrl}
                  alt="Превью фото"
                  className={styles.previewImage}
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
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Отмена
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 