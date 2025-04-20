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
}

export interface Outfit {
  id: string;
  name: string;
  items: string[];
  createdAt: string;
} 