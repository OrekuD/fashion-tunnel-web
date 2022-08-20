import React from "react";
import { Link } from "react-router-dom";
import { cedi, images } from "../../constants";
import Product from "../../models/Product";
import { wrapText } from "../../utils/wrapText";
import classes from "./index.module.scss";

interface Props {
  product: Product;
}

const ProductCard = (props: Props) => {
  return (
    <Link to={`/product/${props.product.id}`} className={classes["container"]}>
      <img
        src={props.product.images[0]}
        alt={props.product.name}
        className={classes["product-image"]}
      />
      <p className={classes["name"]}>{props.product.name}</p>
      <p className={classes["description"]}>
        {wrapText(props.product.description, 70)}
      </p>
      <p className={classes["price"]}>{`${cedi} ${props.product.price.toFixed(
        2
      )}`}</p>
    </Link>
  );
};

export default ProductCard;
