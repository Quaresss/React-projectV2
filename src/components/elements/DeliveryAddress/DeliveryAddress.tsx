import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { FC } from 'react';

import style from './deliveryAddress.module.scss';

type DeliveryAddressProps = {
  address: string;
  classNames?: string;
};

export const DeliveryAddress: FC<DeliveryAddressProps> = ({ address, classNames }) => {
  return (
    <div className={cn(style.address, classNames)}>
      <p className={style.address__deliver}>Адрес доставки:</p>
      <FontAwesomeIcon className={style.address__icon} icon={faLocationDot} />
      <span className={cn(style.address__location, style.address__location_weight)}>{address}</span>
    </div>
  );
};
