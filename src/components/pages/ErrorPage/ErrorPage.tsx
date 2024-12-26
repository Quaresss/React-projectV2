import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { useScrollTo } from '../../../hooks/useScrollTo';
import style from './errorPage.module.scss';

export const ErrorPage = () => {
  useScrollTo();

  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={style.errorPage}>
        <div className={style.errorPage__container}>
          <h1 className={style.errorPage__title}>Извините, произошла непредвиденная ошибка:</h1>

          <p className={style.errorPage__text}>
            <div className={style.errorPage__text}>{error.status}</div>
            <div className={style.errorPage__text}>{error.data}</div>
          </p>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className={style.errorPage}>
        <div className={style.errorPage__container}>
          <h1 className={style.errorPage__title}>Упс! Неожиданная ошибка.</h1>
          <p className={style.errorPage__text}>Что-то пошло не так.</p>
          <div className={style.errorPage__text}>{error.message}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.errorPage}>
        <div className={style.errorPage__container}>
          <h1 className={style.errorPage__title}>Упс! Неожиданная ошибка.</h1>
          <p className={style.errorPage__text}>Что-то пошло не так</p>
        </div>
      </div>
    );
  }
};
