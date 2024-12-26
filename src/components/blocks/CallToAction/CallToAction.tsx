import { FC } from 'react';
import { Link as LinkScroll } from 'react-scroll';

import { OrderButton } from '../../ui/buttons/OrderButton';
import style from './callToAction.module.scss';

export const CallToAction: FC = () => {
  return (
    <div className={style.actionBlock}>
      <div className="container">
        <div className={style.action}>
          <p className={style.action__title}>Готовы сделать заказ?</p>

          <LinkScroll duration={500} offset={-70} smooth={true} spy={true} to="featuredRestaurants">
            <OrderButton classNames={style.action__btn} name={'Заказать'} />
          </LinkScroll>
        </div>
      </div>
    </div>
  );
};
