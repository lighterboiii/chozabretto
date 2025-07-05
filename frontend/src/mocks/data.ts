import { ClothingItem, Outfit } from '../types/index';

export const mockClothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Синие джинсы',
    type: 'jeans',
    color: 'синий'
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
    color: 'белый'
  },
  {
    id: '4',
    name: 'Кроссовки Nike',
    type: 'shoes',
    color: 'white',
  },
  {
    id: '5',
    name: 'Черные кеды',
    type: 'shoes',
    color: 'черный'
  }
];

export const mockOutfits: Outfit[] = [
  {
    id: '1',
    name: 'Повседневный образ',
    items: ['1', '2', '3'],
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'Весенний образ',
    items: ['2', '3', '1'],
    createdAt: new Date().toISOString(),
  },
]; 