export type ClothingType = 
  | 'jeans'
  | 'shorts'
  | 'jacket'
  | 'windbreaker'
  | 'hoodie'
  | 'sweater'
  | 'pants'
  | 'shoes'
  | 'hat'
  | 't-shirt'
  | 'shirt';

  export interface ClothingItem {
    id: string;
    name: string;
    type: ClothingType;
    color?: string;
    imageUrl?: string;
    userId?: string;
  }
  

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  createdAt: string;
  userId?: string;
}

export interface User {
  id: string;
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  createdAt: string;
} 