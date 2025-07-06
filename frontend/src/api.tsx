// export interface ClothingItem {
//   id: string;
//   name: string;
//   type: string;
//   color?: string;
//   imageUrl?: string;
// }
import { ClothingItem, Outfit, User } from './types/index'

const API_BASE = "http://localhost:4000";

export async function fetchClothingList(userId?: string): Promise<ClothingItem[]> {
  const url = userId ? `${API_BASE}/clothing?userId=${userId}` : `${API_BASE}/clothing`;
  console.log('Fetching clothing from:', url);
  const res = await fetch(url);
  console.log('Clothing response status:', res.status);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки списка: ${res.status}`);
  }
  const data = await res.json();
  console.log('Clothing data:', data);
  return data;
}

export async function createClothing(item: Omit<ClothingItem, "id">, imageFile?: File, userId?: string): Promise<ClothingItem> {
  const formData = new FormData();
  formData.append("name", item.name);
  formData.append("type", item.type);
  if (item.color) formData.append("color", item.color);
  if (imageFile) formData.append("image", imageFile);
  if (userId) formData.append("userId", userId);

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
export async function fetchOutfitsList(userId?: string): Promise<Outfit[]> {
  const url = userId ? `${API_BASE}/outfits?userId=${userId}` : `${API_BASE}/outfits`;
  console.log('Fetching outfits from:', url);
  const res = await fetch(url);
  console.log('Outfits response status:', res.status);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки наборов: ${res.status}`);
  }
  const data = await res.json();
  console.log('Outfits data:', data);
  return data;
}

export async function createOutfit(outfit: Omit<Outfit, "id" | "createdAt">, userId?: string): Promise<Outfit> {
  const outfitData = userId ? { ...outfit, userId } : outfit;
  console.log('Creating outfit with data:', outfitData);
  
  const res = await fetch(`${API_BASE}/outfits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(outfitData),
  });

  console.log('Outfit creation response status:', res.status);
  if (!res.ok) {
    throw new Error(`Ошибка создания набора: ${res.status}`);
  }
  const data = await res.json();
  console.log('Outfit created successfully:', data);
  return data;
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
export async function createOrUpdateUser(userData: {
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}): Promise<User> {
  console.log('Creating/updating user with data:', userData);
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log('User creation response status:', res.status);
  if (!res.ok) {
    throw new Error(`Ошибка сохранения пользователя: ${res.status}`);
  }
  const data = await res.json();
  console.log('User creation response data:', data);
  return data;
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
