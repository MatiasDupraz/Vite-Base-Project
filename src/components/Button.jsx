import React from "react";
import classNames from "classnames";

const Button = ({ button, toggleSuccess }) => {
  let successState = null;
  if (button) {
    if (button.success) {
      successState = true;
    } else if (button.success === false) {
      successState = false;
    }
  }

  const label = successState ? "Success" : "Error";
  const buttonClassName = classNames(
    "w-20 h-10 border-white rounded-md hover:text-white ease-linear duration-300 transition-all",
    successState ? "bg-green-900" : "bg-red-900"
  );
  const simpleButtonClassName = classNames(
    "w-20 h-10 border-white rounded-md hover:text-white ease-linear duration-300 transition-all bg-white hover:bg-neutral-900"
  );
  return successState || successState === false ? (
    <button className={buttonClassName} onClick={toggleSuccess}>
      {label}
    </button>
  ) : (
    <button className={simpleButtonClassName}>{label}</button>
  );
};

export default Button;
