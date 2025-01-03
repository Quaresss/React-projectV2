import cn from 'classnames';
import { Link } from 'react-router-dom';

import { DeliveryStatus, DeliveryType } from '../../../store/slices/location/types';
import { OperatingStatusItem } from '../../../store/slices/restaurants/types';
import style from './panelWithAddress.module.scss';

type PanelWithAddressProps = {
  address: string;
  isClosed?: boolean;
  item?: OperatingStatusItem;
  status?: DeliveryStatus | null;
  type?: DeliveryType;
};

export const PanelWithAddress = ({ address, isClosed, item, status, type }: PanelWithAddressProps) => {
  if (isClosed) {
    return (
      <div className={style.address}>
        <p className={style.addressItem}>Магазин закрыт</p>
      </div>
    );
  }

  if (type === DeliveryType.DELIVERY && status === DeliveryStatus.YES) {
    return (
      <div className={style.address}>
        <p className={style.addressItem}>
          <span className={style.addressTitle}>Статус доставки:</span> {status}
        </p>
        <p className={style.addressItem}>
          <span className={style.addressTitle}> Адрес:</span> {address}
        </p>
      </div>
    );
  }



  if (type === DeliveryType.DELIVERY && status === null) {
    return (
      <div className={cn(style.address, style.address_theme)}>
        <Link className={style.addressLink} to={'/'}>
          Выберите адрес доставки
        </Link>
      </div>
    );
  }

  if (type === DeliveryType.PICKUP && item?.address) {
    return (
      <div className={style.address}>
        <p className={style.addressItem}>
          <span className={style.addressTitle}>Адрес:</span> {item?.address.city}, {item?.address.street_addr},{' '}
          {item?.address.house}
        </p>{' '}
      </div>
    );
  }

  if (type === DeliveryType.PICKUP && !item?.address) {
    return (
      <div className={cn(style.address, style.address_theme)}>
        <Link className={style.addressLink} to={'/'}>
          Обновить страницу
        </Link>
      </div>
    );
  }

  return null;
};
