import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faEnvelope,
  faAnglesRight,
  faCaretRight,
  faLocationDot,
  faPhone,
  faMagnifyingGlass,
  faTruckFast,
  faCaretUp,
  faCaretDown,
  faXmark,
  faScroll,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import {
  faWhatsapp,
  faInstagram,
  faFacebook,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

const Icon = ({
  user,
  cart,
  leftArrow,
  rightArrow,
  upArrow,
  downArrow,
  rightArrowSimple,
  whatsapp,
  map,
  phone,
  mail,
  instagram,
  facebook,
  search,
  className,
  disableHover,
  truck,
  cross,
  mastercard,
  visa,
  list,
  ...rest
}) => {
  const [isHovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disableHover) {
      setHovered(true);
    }
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };

  let icon = null;

  if (user) icon = faUser;
  else if (cart) icon = faCartShopping;
  else if (rightArrow) icon = faAnglesRight;
  else if (rightArrowSimple) icon = faCaretRight;
  else if (whatsapp) icon = faWhatsapp;
  else if (map) icon = faLocationDot;
  else if (instagram) icon = faInstagram;
  else if (phone) icon = faPhone;
  else if (mail) icon = faEnvelope;
  else if (facebook) icon = faFacebook;
  else if (search) icon = faMagnifyingGlass;
  else if (truck) icon = faTruckFast;
  else if (upArrow) icon = faCaretUp;
  else if (downArrow) icon = faCaretDown;
  else if (cross) icon = faXmark;
  else if (mastercard) icon = faCcMastercard;
  else if (visa) icon = faCcVisa;
  else if (list) icon = faScroll;
  else if (leftArrow) icon = faArrowLeft;

  return (
    <FontAwesomeIcon
      icon={icon}
      {...rest}
      onMouseEnter={handleMouseEnter}
      className={className}
      onMouseLeave={handleMouseLeave}
      {...(isHovered && !disableHover ? { fade: "fade" } : {})}
    />
  );
};

export default Icon;
