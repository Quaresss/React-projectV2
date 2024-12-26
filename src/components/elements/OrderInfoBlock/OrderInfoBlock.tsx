import { FC } from 'react';

import style from './orderInfoBlock.module.scss';

type OrderInfoBlockProps = {
  price: number;
  quantity: number;
};

export const OrderInfoBlock: FC<OrderInfoBlockProps> = ({ price, quantity }) => {
  return (
    <div className={style.orderInfo}>
      Ваш заказ на сумму{' '}
      <span className={style.orderInfo__result_color}>&#36;{price && price.toFixed(2)}</span> и{' '}
      <span className={style.orderInfo__result_color}>{quantity}</span> шт.
    </div>
  );
};
