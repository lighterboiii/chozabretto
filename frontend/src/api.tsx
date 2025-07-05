// export interface ClothingItem {
//   id: string;
//   name: string;
//   type: string;
//   color?: string;
//   imageUrl?: string;
// }
import { ClothingItem } from './types/index'

const API_BASE = "http://localhost:4000";

export async function fetchClothingList(): Promise<ClothingItem[]> {
  const res = await fetch(`${API_BASE}/clothing`);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки списка: ${res.status}`);
  }
  return res.json();
}

export async function createClothing(item: Omit<ClothingItem, "id">, imageFile?: File): Promise<ClothingItem> {
  const formData = new FormData();
  formData.append("name", item.name);
  formData.append("type", item.type);
  if (item.color) formData.append("color", item.color);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/clothing`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Ошибка создания вещи: ${res.status}`);
  }
  return res.json();
}

export async function updateClothing(
  id: string,
  item: Omit<ClothingItem, "id">,
  imageFile?: File
): Promise<ClothingItem> {
  const formData = new FormData();
  formData.append("name", item.name);
  formData.append("type", item.type);
  if (item.color) formData.append("color", item.color);
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(`${API_BASE}/clothing/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Ошибка обновления вещи: ${res.status}`);
  }
  return res.json();
}

export async function deleteClothing(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/clothing/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Ошибка удаления вещи: ${res.status}`);
  }
}
