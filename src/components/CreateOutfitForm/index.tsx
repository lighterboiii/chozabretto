import React, { useState } from 'react';
import { ClothingItem, ClothingType } from '../../types/index';
import styles from './CreateOutfitForm.module.css';

interface CreateOutfitFormProps {
  clothingItems: ClothingItem[];
  onSubmit: (outfit: { name: string; items: string[] }) => void;
  onClose: () => void;
}

const clothingTypes: ClothingType[] = [
  'jeans',
  'shorts',
  'jacket',
  'windbreaker',
  'hoodie',
  'sweater',
  'pants',
  'shoes',
  'hat',
  't-shirt',
  'shirt'
];

export const CreateOutfitForm: React.FC<CreateOutfitFormProps> = ({
  clothingItems,
  onSubmit,
  onClose
}) => {
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [selectedType, setSelectedType] = useState<ClothingType | 'all'>('all');

  const filteredItems = selectedType === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.type === selectedType);

  const handleItemSelect = (item: ClothingItem) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    onSubmit({
      name,
      items: selectedItems.map(item => item.id)
    });
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Создать набор</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название набора:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Фильтр по типу:</label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ClothingType | 'all')}
            >
              <option value="all">Все типы</option>
              {clothingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.itemCard} ${selectedItems.some(selected => selected.id === item.id) ? styles.selected : ''}`}
                onClick={() => handleItemSelect(item)}
              >
                <div className={styles.itemType}>{item.type}</div>
                <div className={styles.itemName}>{item.name}</div>
                {item.color && <div className={styles.itemColor}>{item.color}</div>}
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose}>Отмена</button>
            <button 
              type="submit" 
              disabled={selectedItems.length === 0}
            >
              Создать набор
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 