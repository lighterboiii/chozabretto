import React from 'react';
import { useTelegramContext } from '../../contexts/TelegramContext';
import styles from './TelegramUserInfo.module.css';

export const TelegramUserInfo: React.FC = () => {
  const { user: telegramUser, isAvailable } = useTelegramContext();

  if (!isAvailable || !telegramUser) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="section-header">Профиль Telegram</h2>
      </div>
      
      <div className="telegram-card">
        <div className={styles.userInfo}>
          {telegramUser.photo_url && (
            <div className={styles.avatar}>
              <img 
                src={telegramUser.photo_url} 
                alt="Avatar" 
                className={styles.avatarImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className={styles.userDetails}>
            <h3 className={styles.userName}>
              {telegramUser.first_name}
              {telegramUser.last_name && ` ${telegramUser.last_name}`}
            </h3>
            
            {telegramUser.username && (
              <p className={styles.username}>@{telegramUser.username}</p>
            )}
            
            <div className={styles.userStats}>
              <span className={styles.stat}>
                <strong>ID:</strong> {telegramUser.id}
              </span>
              
              {telegramUser.is_premium && (
                <span className={styles.premiumBadge}>
                  <strong>Premium</strong> ✨
                </span>
              )}
              
              {telegramUser.language_code && (
                <span className={styles.stat}>
                  <strong>Язык:</strong> {telegramUser.language_code.toUpperCase()}
                </span>
              )}
            </div>
            
            {telegramUser.added_to_attachment_menu && (
              <p className={styles.hint}>
                ✅ Добавлен в меню вложений
              </p>
            )}
            
            {telegramUser.allows_write_to_pm && (
              <p className={styles.hint}>
                ✅ Разрешены сообщения в ЛС
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 