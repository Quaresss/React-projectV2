/* eslint-disable perfectionist/sort-objects */
import { ProductOrderType, ProductSortingType } from '../slices/filters/types';

export interface FiltersForProducts {
  category?: string;
  currentPage?: number;
  id?: string;
  limit?: number;
  orderType?: ProductOrderType;
  rating?: number;
  restaurantId?: string;
  searchValue?: string;
  sortType?: ProductSortingType;
}

export function getFilterForProducts({
  category,
  currentPage,
  id,
  limit,
  orderType,
  rating,
  restaurantId,
  searchValue,
  sortType,
}: FiltersForProducts): string {
  const filters = {
    page: currentPage ? `page=${currentPage}` : 'page=1',
    limit: limit ? `limit=${limit}` : 'limit=4',
    category: category && category !== 'Всё' ? `category_like=${category}` : '',
    id: id ? `id=${id}` : '',
    orderType: sortType && orderType ? `_order=${orderType}` : '',
    rating: rating ? `rating=${rating}` : '',
    restaurantId: restaurantId ? `restaurantId=${restaurantId}` : '',
    searchValue: searchValue ? `title_like=${encodeURIComponent(searchValue)}` : '',
    sortType: sortType ? `_sort=${sortType}` : '',
  };

 
  return `?${Object.values(filters).filter(Boolean).join('&')}`;
}