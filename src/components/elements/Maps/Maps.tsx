import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ymaps from 'yandex-maps';

import { ReactComponent as Preloader } from '../../../assets/images/find-food/preloader.svg';
import { ReactComponent as LocationMark } from '../../../assets/images/search-panel/location.svg';
import { useAppSelector } from '../../../store';
import { Coords, DeliveryStatus, DistanceItem } from '../../../store/slices/location/types';
import { placemarkSelector } from '../../../store/slices/restaurants/slice';
import { Balloon } from './Balloon';
import style from './maps.module.scss';

export type ExtendedAddress = {
  address: string;
  premiseNumber: null | string;
};

export enum ModeOfUsingMaps {
  DRAG = 'drag',
  SEARCH = 'search',
}

type MapsProps = {
  coord: Coords;
  handleAddressChange: ({ address, premiseNumber }: ExtendedAddress) => void;
  handleCoordChange: (coord: Coords) => void;
  handleModeChange: (mode: string) => void;
  handleStatusChange: (status: DeliveryStatus) => void;
  mode: string;
  place: string;
};

export const Maps: FC<MapsProps> = ({
  coord,
  handleAddressChange,
  handleCoordChange,
  handleModeChange,
  mode,
  place,
}) => {
  const [maps, setMaps] = useState<any>();

  const [activeAction, setActiveAction] = useState<boolean>(false);
  const [visibleBalloon, setVisibleBalloon] = useState<boolean>(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const mapRef = useRef<any>();
  const placemarkRef = useRef<ymaps.Map>();

  const updateSearchValue = useCallback(
    debounce((coord: Coords) => {
      handleCoordChange(coord);
    }, 500),
    [],
  );

  const getGeoLocation = (event: any) => {
    handleModeChange(ModeOfUsingMaps.DRAG);
    const coord = event.get('target').getCenter();
    updateSearchValue(coord);
  };

  const handleBoundsChange = (event: Event) => {
    getGeoLocation(event);
  };

  const handleZoomChange = (event: Event) => {
    getGeoLocation(event);
  };

  const onLoad = (map: any) => {
    setMaps(map);
  };

  useEffect(() => {
    if (mode === ModeOfUsingMaps.SEARCH) {
      mapRef?.current?.panTo(coord, { delay: 500, safe: true });
    }
  }, [mode, coord]);

  useEffect(() => {
    if (mode === ModeOfUsingMaps.DRAG && maps && coord?.length) {
      setIsLoaded(false);

      const resp = maps?.geocode(coord, { kind: 'house' });
      resp
        .then((res: any) => {
          setIsLoaded(true);
          const geocodeResult: ymaps.GeocodeResult = res.geoObjects.get(0);
          handleAddressChange({
            address: geocodeResult?.getAddressLine(),

            premiseNumber: geocodeResult?.getPremiseNumber(),
          });
        })
        .catch((error: any) => {
          console.error('The Promise is rejected!', error);
        });
    }
  }, [coord, maps]);

  const handleActionBegin = () => {
    setVisibleBalloon(false);
    setActiveAction(true);
  };

  const handleActionEnd = () => {
    setActiveAction(false);
  };

  const handleBalloonStatusChange = () => {
    setVisibleBalloon(!visibleBalloon);
  };

  return (
    <YMaps
      query={{
        apikey: '131626fc-3ab4-44a3-8420-b048a353a327',
        coordorder: 'longlat',
        lang: 'ru_RU',
      }}
    >
      <Map
        defaultState={{
          behaviors: ['default'],
          center: coord,
          controls: ['zoomControl', 'geolocationControl'],
          zoom: 11,
        }}
        modules={[
          'geolocation',
          'geocode',
          'control.ZoomControl',
          'geoObject.addon.balloon',
          'control.GeolocationControl',
          'geoQuery',
          'coordSystem.geo',
          'formatter',
        ]}
        className={style.map}
        instanceRef={mapRef}
        onActionBegin={handleActionBegin}
        onActionEnd={handleActionEnd}
        onBoundsChange={handleBoundsChange}
        onLoad={onLoad}
        onWheel={handleZoomChange}
      >
        <div className={cn(style.placemark, { [style.active]: activeAction })} onClick={handleBalloonStatusChange}>
          <LocationMark className={cn(style.placemark__icon, { [style.active]: activeAction })} />
          {!isLoaded && <Preloader className={style.placemark__preloader} />}
        </div>

        <Placemark geometry={coord} instanceRef={placemarkRef} options={{ iconOffset: [0, 0], visible: false }} />

        <Balloon address={place} coord={coord} handleClick={handleBalloonStatusChange} isActive={visibleBalloon} />
      </Map>
    </YMaps>
  );
};
