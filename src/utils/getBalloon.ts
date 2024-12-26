export type Balloon = {
  backgroundId: string;
  city: string;
  id: string;
  logo_photos: string;
  name: string;
  street_addr: string;
};

export const getBalloon = ({
  backgroundId,
  city,
  id,
  logo_photos,
  name,
  
  street_addr,
}: Balloon) => {
  return `<div class="balloon">
    <a href="/foodwagon-online-shop/#/restaurant/${id}/product/${backgroundId}" class="balloon__link"/>
        <div class="balloon__logo">
          <img
            class="balloon__image"
            src=${process.env.PUBLIC_URL}${logo_photos}
            alt=${name}
          />
        </div>
        <div class="balloon__rest">${name}</div>
    </a>

    <div class="balloon__contact">
      phone:
      <a class="balloon__contact-link" href="tel:">
       
      </a>
    </div>
    <div class="balloon__address">${city}, ${street_addr}</div>
  </div>`;
};
