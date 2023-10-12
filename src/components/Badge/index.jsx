import React from "react";
//import styles
import "./Badge.scss";
//import classNames library
import classNames from "classnames";

const Badge = ({ onClick, color, className }) => (
  <i
    onClick={onClick}
    className={classNames("badge", { [`badge--${color}`]: color }, className)}
  ></i>
);

export default Badge;
