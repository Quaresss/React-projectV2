import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FC, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useScrollTo } from '../../../hooks/useScrollTo';
import { useAppDispatch } from '../../../store';
import { setToken, setUser } from '../../../store/slices/user/slice';
import { AuthAPIErrors } from '../../../store/slices/user/types';
import { loginSchema } from '../../../utils/fieldValidationSchemes';
import { AuthRegForm } from '../../elements/AuthRegForm';
import Spinner from '../../ui/Spinner/Spinner';
import style from './loginPage.module.scss';

export const Login: FC = () => {
  const auth = getAuth();

  useScrollTo();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
          }),
        );
        navigate('/');
        return user.getIdTokenResult();
      })
      .then(({ token }) => {
        dispatch(setToken(token));
      })
      .catch(({ code, message }) => {
        switch (code) {
          case AuthAPIErrors.INVALID_CREDENTIAL:
            setErrorMessage('Invalid login details');
            break;

          default:
            setErrorMessage(message);
            break;
        }
      });
  };

  return (
    <div className={style.login}>
      <Suspense fallback={<Spinner />}>
        <AuthRegForm errorMessage={errorMessage} handleClick={handleLogin} schema={loginSchema} title={'Войти'} />
      </Suspense>
    </div>
  );
};
