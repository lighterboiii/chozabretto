import React from 'react';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
  currentSection: 'clothing' | 'outfits' | 'profile';
  onSectionChange: (section: 'clothing' | 'outfits' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentSection,
  onSectionChange
}) => {
  return (
    <div className={styles.bottomNav}>
      <button
        className={`${styles.navButton} ${currentSection === 'clothing' ? styles.active : ''}`}
        onClick={() => onSectionChange('clothing')}
      >
        <span className={styles.icon}>👕</span>
        <span className={styles.label}>Одежда</span>
      </button>
      
      <button
        className={`${styles.navButton} ${currentSection === 'outfits' ? styles.active : ''}`}
        onClick={() => onSectionChange('outfits')}
      >
        <span className={styles.icon}>👔</span>
        <span className={styles.label}>Наборы</span>
      </button>
      
      <button
        className={`${styles.navButton} ${currentSection === 'profile' ? styles.active : ''}`}
        onClick={() => onSectionChange('profile')}
      >
        <span className={styles.icon}>👤</span>
        <span className={styles.label}>Профиль</span>
      </button>
    </div>
  );
}; 