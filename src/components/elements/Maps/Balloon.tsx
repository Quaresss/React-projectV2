import cn from 'classnames';
import { FC } from 'react';

import { ReactComponent as Close } from '../../../assets/images/find-food/close.svg';
import { Coords, DeliveryStatus } from '../../../store/slices/location/types';
import style from './balloon.module.scss';

type BalloonProps = {
  address: string;
  coord: Coords;
  handleClick: () => void;
  isActive: boolean;
  status?: DeliveryStatus;
};

export const Balloon: FC<BalloonProps> = ({ address, coord, handleClick, isActive}) => {
  const coords = coord.map((el) => Number(el.toFixed(6))).join(', ');

  return (
    <div className={cn(style.balloon, { [style.visible]: isActive })}>
      <div className={style.balloon__title}>Ваше местоположение:</div>
      <div className={style.balloon__address}>{address}</div>
      <div className={style.balloon__coords}>Координаты: {coords}</div>
      <button className={style.balloon__close} onClick={handleClick}>
        <Close className={style.balloon__closeIcon} />
      </button>
    </div>
  );
};
