import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { RouteNames } from '../../../router';
import { useAppSelector } from '../../../store';
import { addressSelector } from '../../../store/slices/location/slice';
import { isAuthSelector } from '../../../store/slices/user/slice';
import { MenuButton } from '../../ui/buttons/MenuButton';
import { DeliveryAddress } from '../DeliveryAddress';
import { NavItem } from '../NavItem';
import style from './mobileMenu.module.scss';

type MobileMenuProps = {
  handleLogOut: () => void;
};

export const MobileMenu: FC<MobileMenuProps> = ({ handleLogOut }) => {
  const { pathname } = useLocation();

  const address = useAppSelector(addressSelector);
  const isAuth = useAppSelector(isAuthSelector);

  useEffect(() => setMenuIsVisible(false), [pathname]);

  const [menuIsVisible, setMenuIsVisible] = useState(false);

  const handleMenuClick = () => {
    setMenuIsVisible(!menuIsVisible);
  };

  const getActiveClassName = ({ isActive }: { isActive: boolean }) =>
    [isActive ? style.active : '', style.menu__link].join(' ');

  const LINKS = [
    { name: 'Главное меню', path: RouteNames.HOME },
    { name: 'Поиск', path: RouteNames.SEARCH },
    { name: 'Корзина', path: RouteNames.CART },
    { name: 'Заказы', path: RouteNames.ORDERS },
  ];

  return (
    <div className={style.mobileMenu}>
      <MenuButton handleClick={handleMenuClick} isVisible={menuIsVisible} />

      <nav
        className={cn(style.menu, {
          [style.menuClosed]: !menuIsVisible,
        })}
      >
        <ul >
          {LINKS?.length && LINKS.map(({ name, path }) => <NavItem key={path} name={name} path={path} />)}

          <li className={style.menu__item}>
            {isAuth ? (
              <button className={style.menu__link} onClick={handleLogOut}>
                Выйти
              </button>
            ) : (
              <NavLink className={getActiveClassName} to={'/login'}>
                Войти
              </NavLink>
            )}
          </li>

          <li className={style.menu__item}>
            <DeliveryAddress address={address} classNames={style.menu__method} />
          </li>
        </ul>
      </nav>
    </div>
  );
};
