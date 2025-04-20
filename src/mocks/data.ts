import { ClothingItem, Outfit } from '../types';

export const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Синие джинсы',
    type: 'jeans',
    color: 'blue',
  },
  {
    id: '2',
    name: 'Черная куртка',
    type: 'jacket',
    color: 'black',
  },
  {
    id: '3',
    name: 'Белая футболка',
    type: 't-shirt',
    color: 'white',
  },
  {
    id: '4',
    name: 'Кроссовки Nike',
    type: 'shoes',
    color: 'white',
  },
];

export const mockOutfits: Outfit[] = [
  {
    id: '1',
    name: 'Повседневный образ',
    items: [mockClothingItems[0], mockClothingItems[2], mockClothingItems[3]],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Весенний образ',
    items: [mockClothingItems[1], mockClothingItems[2], mockClothingItems[0]],
    createdAt: new Date().toISOString(),
  },
]; 