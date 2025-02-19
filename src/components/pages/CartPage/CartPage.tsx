import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useScrollTo } from '../../../hooks/useScrollTo';
import { RouteNames } from '../../../router';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addedGoodsSelector, clearCart, totalQuantitySelector } from '../../../store/slices/cart/slice';
import { fetchRestaurants, isLoadedSelector, setListOfOperatingStatus } from '../../../store/slices/restaurants/slice';
import { emailSelector } from '../../../store/slices/user/slice';
import { ProductList } from '../../elements/ProductList';
import { RestaurantInfo } from '../../elements/ProductList/ProductList';
import { Modal } from '../../ui/Modal';
import { Popup } from '../../ui/Popup';
import style from './cartPage.module.scss';

export const Cart: FC = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');

  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState(0);

  const totalQuantity = useAppSelector(totalQuantitySelector);
  const addedGoods = useAppSelector(addedGoodsSelector);
  const email = useAppSelector(emailSelector);
  const isLoaded = useAppSelector(isLoadedSelector);

  useScrollTo();

  const handleClosePopup = () => {
    setVisiblePopup(false);
  };

  const handleClearOrder = (id: string) => {
    dispatch(clearCart({ restaurantId: id }));
    setVisiblePopup(false);
  };

  const handleCloseModal = (id: string) => {
    dispatch(clearCart({ restaurantId: id }));
    setVisibleModal(false);
  };

  const handleRestaurantInfoChange = ({ orderNumber, restaurantId, restaurantName }: RestaurantInfo) => {
    setName(restaurantName);
    setId(restaurantId);
    if (orderNumber) setOrderNumber(orderNumber);
  };

  const handleVisibleModal = (status: boolean) => {
    setVisibleModal(status);
  };

  const handleVisiblePopup = (status: boolean) => {
    setVisiblePopup(status);
  };

  useEffect(() => {
    dispatch(
      fetchRestaurants({
        limit: 10,
      }),
    );
  }, []);

  useEffect(() => {
    if (isLoaded) {
      dispatch(setListOfOperatingStatus());
    }
  }, [isLoaded]);

  if (!totalQuantity) {
    return (
      <div className={style.cart}>
        <div className={cn(style.cart__container, 'container')}>
          <div className={style.cart__inner}>
            <div className={style.cart__empty}>
              <p className={style.cart__name}>Корзина пуста</p>
              <p className={style.cart__message}>Воспользуйтесь поиском, чтобы найти все, что вам нужно.</p>
              <p className={style.cart__links}>
                Перейти на{' '}
                <Link className={style.cart__linkItem} to={RouteNames.SEARCH}>
                  страницу поиска
                </Link>{' '}
                или{' '}
                <Link className={style.cart__linkItem} to={RouteNames.HOME}>
                  главного меню
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.cart}>
      <div className={cn(style.cart__container, 'container')}>
        <h1 className={style.cart__title}>Корзина</h1>
        <div className={style.cart__inner}>
          {totalQuantity &&
            addedGoods.map((restaurant) => (
              <ProductList
                handleRestaurantInfoChange={handleRestaurantInfoChange}
                handleVisibleModal={handleVisibleModal}
                handleVisiblePopup={handleVisiblePopup}
                key={uuidv4()}
                restaurantInfo={restaurant}
              />
            ))}
        </div>
      </div>

      <Modal
        email={email || ''}
        handleCloseModal={handleCloseModal}
        id={id}
        isOpen={visibleModal}
        name={name}
        orderNumber={orderNumber}
      />

      <Popup handleClose={handleClosePopup} handleOk={handleClearOrder} id={id} isOpen={visiblePopup}>
        <>
          Вы уверены, что хотите очистить корзину от <span className={style.popup__name}>«{name}»</span>?
        </>
      </Popup>
    </div>
  );
};
