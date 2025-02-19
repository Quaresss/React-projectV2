import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { FC, KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Spinner } from '../../../assets/images/search-panel/spinner.svg';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { RouteNames } from '../../../router';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  deliveryTypeSelector,
  errorSelector,
  fetchLocation,
  locationListSelector,
  setDeliveryType,
  setLocation,
  statusSelector,
} from '../../../store/slices/location/slice';
import { Coords, DeliveryStatus, DeliveryType, DistanceItem, LocationItem } from '../../../store/slices/location/types';
import { Status } from '../../../store/utils/getExtraReducers';
import { DeliveryMethod } from '../../elements/DeliveryMethod';
import { Button } from '../../elements/DeliveryMethod/DeliveryMethod';
import { ListPopup } from '../../elements/ListPopup';
import { ExtendedAddress, Maps, ModeOfUsingMaps } from '../../elements/Maps/Maps';
import { TextInput } from '../../ui/TextInput';
import { SearchButton } from '../../ui/buttons/SearchButton';
import style from './findFood.module.scss';

const MemoDeliveryMethod = memo(DeliveryMethod);

export const FindFood: FC = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);

  const dispatch = useAppDispatch();

  const list = useAppSelector(locationListSelector);
  const error = useAppSelector(errorSelector);
  const status = useAppSelector(statusSelector);
  const deliveryType = useAppSelector(deliveryTypeSelector);

  const [listOfDistances, setListOfDistances] = useState<DistanceItem[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>();
  const [premiseNumber, setPremiseNumber] = useState<null | string>();
  const [searchValue, setSearchValue] = useState<Coords | string>('');
  const [visiblePopup, setVisiblePopup] = useState<boolean>(false);
  const [coord, setCoord] = useState<Coords>([48.408462, 54.346119]);
  const [activeType, setActiveType] = useState<DeliveryType>(deliveryType);
  const [place, setPlace] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [isVisibleMap, setIsVisibleMap] = useState(false);

  const navigate = useNavigate();

  const buttons: Button[] = useMemo(() => [{ label: DeliveryType.DELIVERY }, { label: DeliveryType.PICKUP }], []);

  useEffect(() => {
    if (mode === ModeOfUsingMaps.SEARCH) {
      setIsVisibleMap(true);
    }
  }, [mode]);

  const getOutsideClickStatus = (e: MouseEvent) => {
    return popupRef.current?.contains(e.target as Node) || searchRef.current?.contains(e.target as Node) || false;
  };

  const handleOpenPopup = () => setVisiblePopup(true);

  const handleClosePopup = () => setVisiblePopup(false);

  useOutsideClick(getOutsideClickStatus, handleOpenPopup, handleClosePopup);

  useEffect(() => {
    if (searchValue && mode === ModeOfUsingMaps.SEARCH) {
      dispatch(
        fetchLocation({
          searchValue,
        }),
      );
      setVisiblePopup(true);
    }
  }, [searchValue]);

  const setDeliveryAddress = (item: LocationItem) => {
    dispatch(setLocation(item));
    navigate(RouteNames.RESTAURANTS);
  };

  const handleFoodSearch = () => {
    const item: LocationItem = {
      address: place,
      coords: coord,
      deliveryStatus,
      deliveryType: activeType,
      listOfDistances,
    };

    if (premiseNumber) {
      setDeliveryAddress(item);
    }
  };

  const handleSearchValue = useCallback((text: string) => {
    setMode(ModeOfUsingMaps.SEARCH);
    setSearchValue(text);
  }, []);

  const handleCoordChange = useCallback((coords: Coords) => {
    setCoord(coords);
    setSearchValue(coords);
  }, []);

  const handleLocationChange = useCallback(({ address, addressDetails, coords }: LocationItem) => {
    const premiseNumber = addressDetails?.find((el) => el['house'])?.house;
    setMode(ModeOfUsingMaps.SEARCH);
    setPremiseNumber(premiseNumber);
    setPlace(address);
    setCoord(coords);
    setVisiblePopup(false);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (popupRef.current && event.key === 'ArrowDown') {
      event.preventDefault();
      popupRef.current?.focus();
    }

    if (event.key === 'Enter' && list.length) {
      event.preventDefault();
      handleLocationChange(list[0]);
      setMode(ModeOfUsingMaps.SEARCH);
    }
  };

  const handlePopupVisibility = useCallback((status: boolean) => {
    setVisiblePopup(status);
  }, []);

  const handleDeliveryStatusChange = useCallback((status: DeliveryStatus) => {
    setDeliveryStatus(status);
  }, []);

  const handleModeChange = useCallback((mode: string) => {
    setMode(mode);
  }, []);

  const handleAddressChange = useCallback(({ address, premiseNumber }: ExtendedAddress) => {
    setPlace(address);
    setPremiseNumber(premiseNumber);
    setListOfDistances(listOfDistances);
  }, []);

  const handleDeliveryTypeChange = useCallback((label: DeliveryType) => {
    setActiveType(label);
    dispatch(setDeliveryType(label));
  }, []);

  return (
    <main className={style.findFoodWrapper}>
      <div className="container">
        <div className={style.findFood}>
          <h1 className={style.findFood__title}>Добро пожаловать</h1>
          <p className={style.findFood__text}>Воспользуетесь картой, чтобы выбрать адрес доставки</p>

          <div className={style.findFood__searchPanel}>
            <MemoDeliveryMethod
              deliveryType={activeType}
              handleDeliveryTypeChange={handleDeliveryTypeChange}
              list={buttons}
            />
            <div className={style.findFood__search}>
              <div className={style.searchPanel}>
                <TextInput
                  address={place}
                  classNames={style.searchPanel__input}
                  handleKeyDown={handleKeyDown}
                  handleSearchValue={handleSearchValue}
                  placeholder={'Введите свой адрес...'}
                  ref={searchRef}
                >
                  <FontAwesomeIcon className={style.searchPanel__inputIcon} icon={faLocationDot} size="xl" />
                  {status === Status.LOADING && searchValue && (
                    <div className={style.searchPanel__inputLoader}>
                      <Spinner />
                    </div>
                  )}
                </TextInput>

                <SearchButton
                  classNames={cn(style.search__btn, {
                    [style.search__btn_inactive]: !premiseNumber && searchValue,
                  })}
                  handleClick={handleFoodSearch}
                  icon="search"
                  label="Поиск"
                />
              </div>

              <ListPopup
                errorMessage={error}
                handleLocationChange={handleLocationChange}
                handleStatusChange={handlePopupVisibility}
                isOpen={visiblePopup}
                list={list}
                ref={popupRef}
              />
            </div>

            {isVisibleMap && (
              <Maps
                coord={coord}
                handleAddressChange={handleAddressChange}
                handleCoordChange={handleCoordChange}
                handleModeChange={handleModeChange}
                handleStatusChange={handleDeliveryStatusChange}
                mode={mode}
                place={place}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
