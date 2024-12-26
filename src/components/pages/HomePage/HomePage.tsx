import { FC, lazy } from 'react';

import { useScrollTo } from '../../../hooks/useScrollTo';
import style from './home.module.scss';

const CallToAction = lazy(() => import(/*webpackChunkName: "CallToAction"*/ '../../blocks/CallToAction'));
const FeaturedRestaurants = lazy(
  () => import(/*webpackChunkName: "FeaturedRestaurants"*/ '../../blocks/FeaturedRestaurants'),
);
const SearchFood = lazy(() => import(/*webpackChunkName: "SearchFood"*/ '../../blocks/SearchFood'));
const PopularItems = lazy(() => import(/*webpackChunkName: "PopularItems"*/ '../../blocks/PopularItems'));
const FlashDeals = lazy(() => import(/*webpackChunkName: "FlashDeals"*/ '../../blocks/FlashDeals'));
const FindFood = lazy(() => import(/*webpackChunkName: "FindFood"*/ '../../blocks/FindFood'));

export const Home: FC = () => {
  useScrollTo();
  return (
    <div className={style.homePage}>
      <FindFood />
      <FlashDeals />
      <PopularItems />
      <FeaturedRestaurants />
      <SearchFood />
      <CallToAction />
    </div>
  );
};
