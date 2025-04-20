import React, { useState } from 'react';
import { ClothingItem, ClothingType } from '../../types';
import styles from './AddClothingForm.module.css';

interface AddClothingFormProps {
  onSubmit: (item: Omit<ClothingItem, 'id'>) => void;
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

export const AddClothingForm: React.FC<AddClothingFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ClothingType>('t-shirt');
  const [color, setColor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      color: color || undefined,
    });
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Добавить вещь</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="type">Тип:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ClothingType)}
              required
            >
              {clothingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="color">Цвет (опционально):</label>
            <input
              id="color"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit">Добавить</button>
            <button type="button" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}; 