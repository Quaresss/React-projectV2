import cn from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { listOfDistancesSelector } from '../../../store/slices/location/slice';
import {
  fetchRestaurants,
  isLoadedSelector,
  restaurantListSelector,
  setListOfOperatingStatus,
  setPlacemarks,
} from '../../../store/slices/restaurants/slice';
import {
  categorySelector,
  orderTypeSelector,
  setCategory,
  setSortType,
  sortTypeSelector,
} from '../../../store/slices/sortingType/slice';
import { RestaurantOrderType, RestaurantSortingType } from '../../../store/slices/sortingType/types';
import { Restaurant } from '../../../store/utils/getExtraReducers';
import { getListOfNearbyRestaurants } from '../../../utils/getListOfNearbyRestaurants';
import { Categories } from '../../elements/Categories';
import { RestaurantList } from '../../elements/RestaurantList';
import { SortPopup } from '../../elements/SortPopup';
import style from './featuredRestaurants.module.scss';

const categoryNames: string[] = ['Всё', 'Лапша', 'Салат', 'Рыба', 'Мясо', 'Суп', 'Бургер'];

const sortItems = [
  { name: 'популярности', order: RestaurantOrderType.DESC, type: RestaurantSortingType.POPULAR },
  { name: 'рейтингу', order: RestaurantOrderType.DESC, type: RestaurantSortingType.RATING },
  { name: 'скидке', order: RestaurantOrderType.DESC, type: RestaurantSortingType.DISCOUNT },
  { name: 'алфавиту', order: RestaurantOrderType.ASC, type: RestaurantSortingType.NAME },
];

type FeaturedRestaurantsProps = {
  classNames?: string;
  title?: string;
};

export const FeaturedRestaurants: FC<FeaturedRestaurantsProps> = ({ classNames, title }) => {
  const dispatch = useAppDispatch();

  const category = useAppSelector(categorySelector);
  const sortType = useAppSelector(sortTypeSelector);
  const orderType = useAppSelector(orderTypeSelector);

  const isLoaded = useAppSelector(isLoadedSelector);
  const list = useAppSelector(restaurantListSelector);
  const listOfDistances = useAppSelector(listOfDistancesSelector);

  const listCopy = getListOfNearbyRestaurants(listOfDistances, list) as Restaurant[];

  const handleCategoryChange = useCallback((index: number) => {
    dispatch(setCategory(index));
  }, []);

  const handleSortTypeChange = useCallback((sortType: any, orderType: any) => {
    dispatch(setSortType({ orderType, sortType }));
  }, []);

  useEffect(() => {
    dispatch(
      fetchRestaurants({
        category: categoryNames[category],
        orderType,
        sortType,
      }),
    );
  }, [sortType, category, orderType]);

  useEffect(() => {
    if (isLoaded) {
      dispatch(setPlacemarks());
      dispatch(setListOfOperatingStatus());
    }
  }, [isLoaded]);

  return (
    <section className={style.restaurants} id="featuredRestaurants">
      <div className="container">
        <div className={style.restaurantList}>
          <h4 className={cn(style.restaurantList__title, classNames)}>{title ? title : 'Рестораны'}</h4>

          <div className={style.restaurantList__filters}>
            <Categories activeCategory={category} handleCategoryChange={handleCategoryChange} items={categoryNames} />

            <SortPopup
              activeSortType={sortType}
              classNames={style.restaurantList__popup}
              handleSortTypeChange={handleSortTypeChange}
              items={sortItems}
              orderType={orderType}
            />
          </div>
          <RestaurantList isLoading={isLoaded} list={listOfDistances?.length ? listCopy : list} />
        </div>
      </div>
    </section>
  );
};
