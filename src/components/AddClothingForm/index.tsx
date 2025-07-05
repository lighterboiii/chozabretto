import React, { useState, useEffect, useRef } from "react";
import { ClothingItem, ClothingType } from "../../types/index";
import styles from "./AddClothingForm.module.css";

interface AddClothingFormProps {
  onSubmit: (item: Omit<ClothingItem, "id">) => void;
  onClose: () => void;
  onDelete?: () => void;
  initialData?: ClothingItem;
}

const clothingTypes: ClothingType[] = [
  "jeans",
  "shorts",
  "jacket",
  "windbreaker",
  "hoodie",
  "sweater",
  "pants",
  "shoes",
  "hat",
  "t-shirt",
  "shirt",
];

export const AddClothingForm: React.FC<AddClothingFormProps> = ({
  onSubmit,
  onClose,
  onDelete,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<ClothingType>("t-shirt");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setColor(initialData.color || "");
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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
        <h2>{initialData ? "Редактировать вещь" : "Добавить вещь"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="image">Фото (опционально):</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  const previewUrl = URL.createObjectURL(file);
                  setImagePreviewUrl(previewUrl);
                }
              }}
            />
            {imagePreviewUrl && (
              <div className={styles.imagePreview}>
                <img
                  src={imagePreviewUrl}
                  alt="Превью"
                  className={styles.previewImage}
                />
              </div>
            )}
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
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            {initialData && onDelete && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={onDelete}
              >
                Удалить
              </button>
            )}
            <button type="submit">
              {initialData ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
