import { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import style from './modal.module.scss';

type ModalProps = {
  email: string;
  handleCloseModal: (id: string) => void;
  id: string;
  isOpen: boolean;
  name: string;
  orderNumber: number;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ email, handleCloseModal, id, isOpen, name, orderNumber }, ref) => {
    return (
      <CSSTransition classNames="alert" in={isOpen} timeout={300} unmountOnExit>
        <div className={style.popupWrapper}>
          <div className={style.popup} ref={ref}>
            <div className={style.popup__title}>
              <p className={style.popup__name}>
                Заказ № {orderNumber} создан из ресторана «{name}».
              </p>
              <p className={style.popup__name}>Пользователь: {email}</p>
            </div>

            <div className={style.popup__btns}>
              <button className={style.popup__btnClose} onClick={() => handleCloseModal(id)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  },
);
