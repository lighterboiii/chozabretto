// export interface ClothingItem {
//   id: string;
//   name: string;
//   type: string;
//   color?: string;
//   imageUrl?: string;
// }
import { ClothingItem, Outfit, User } from './types/index'

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

// API функции для наборов
export async function fetchOutfitsList(): Promise<Outfit[]> {
  const res = await fetch(`${API_BASE}/outfits`);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки наборов: ${res.status}`);
  }
  return res.json();
}

export async function createOutfit(outfit: Omit<Outfit, "id" | "createdAt">): Promise<Outfit> {
  const res = await fetch(`${API_BASE}/outfits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(outfit),
  });

  if (!res.ok) {
    throw new Error(`Ошибка создания набора: ${res.status}`);
  }
  return res.json();
}

export async function updateOutfit(id: string, outfit: Omit<Outfit, "id" | "createdAt">): Promise<Outfit> {
  const res = await fetch(`${API_BASE}/outfits/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(outfit),
  });

  if (!res.ok) {
    throw new Error(`Ошибка обновления набора: ${res.status}`);
  }
  return res.json();
}

export async function deleteOutfit(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/outfits/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Ошибка удаления набора: ${res.status}`);
  }
}

// API функции для пользователей
export async function getUserByTelegramId(telegramId: number): Promise<User> {
  const res = await fetch(`${API_BASE}/users/telegram/${telegramId}`);
  if (!res.ok) {
    throw new Error(`Ошибка получения пользователя: ${res.status}`);
  }
  return res.json();
}

export async function createOrUpdateUser(userData: {
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error(`Ошибка сохранения пользователя: ${res.status}`);
  }
  return res.json();
}

export async function updateUserProfile(
  userId: string,
  userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
  },
  photoFile?: File
): Promise<User> {
  const formData = new FormData();
  formData.append("firstName", userData.firstName || "");
  formData.append("lastName", userData.lastName || "");
  formData.append("username", userData.username || "");
  if (photoFile) formData.append("photo", photoFile);

  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Ошибка обновления профиля: ${res.status}`);
  }
  return res.json();
}
