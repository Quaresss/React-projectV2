/* eslint-disable perfectionist/sort-objects */
import { RestaurantOrderType, RestaurantSortingType } from '../slices/sortingType/types';

export interface FiltersForRestaurants {
  category?: string;
  currentPage?: number;
  limit?: number;
  orderType?: RestaurantOrderType;
  restaurantId?: string;
  sortType?: RestaurantSortingType;
}

export function getFilterForRestaurants({
  category,
  currentPage,
  limit,
  orderType,
  restaurantId,
  sortType,
}: FiltersForRestaurants) {
  const sortFilter =
    sortType === 'rating'
      ? '_sort=weighted_rating_value'
      : sortType === 'popular'
        ? '_sort=aggregated_rating_count'
        : sortType === 'name'
          ? '_sort=name'
          : sortType === 'discount'
            ? '_sort=discount'
            : '';

  const filters = {
    page: currentPage ? `page=${currentPage}` : 'page=1',
    limit: limit ? `limit=${limit}` : 'limit=8',
    cuisines: category && category !== 'Всё' ? `cuisines_like=${category}` : '',
    order: sortFilter && orderType ? `_order=${orderType}` : '',
    sort: sortFilter,
    id: restaurantId ? `id=${restaurantId}` : '',
  };

  const queryString = Object.values(filters).filter(Boolean).join('&');
  return queryString ? `?${queryString}` : '';
}
