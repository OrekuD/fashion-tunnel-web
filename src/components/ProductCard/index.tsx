import React from "react";
import { Link } from "react-router-dom";
import { cedi, images } from "../../constants";
import { wrapText } from "../../utils/wrapText";
import classes from "./index.module.scss";

const ProductCard = () => {
  return (
    <Link to={`/product/4`} className={classes["container"]}>
      <img src={images[2]} alt="" className={classes["product-image"]} />
      <p className={classes["name"]}>Off-White</p>
      <p className={classes["description"]}>
        {wrapText(
          "Dolor proident commodo nisi pariatur non ad minim mollit eu id. Et sit nostrud qui tempor enim Lorem. Quis culpa pariatur culpa magna cupidatat quis fugiat. Exercitation eu ea elit occaecat incididunt nisi aliqua aliquip est eu pariatur. Nisi excepteur magna mollit dolor id do. Nisi in ut amet et excepteur amet commodo anim id. Eiusmod enim sit et do pariatur ipsum non velit.",
          70
        )}
      </p>
      <p className={classes["price"]}>{`${cedi}123.99`}</p>
    </Link>
  );
};

export default ProductCard;
