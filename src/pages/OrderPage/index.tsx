import React from "react";
import Header from "../../components/Header";
import classes from "./index.module.scss";

const OrderPage = () => {
  return (
    <div className={classes["container"]}>
      <Header />
      <p>Order page</p>
    </div>
  );
};

export default OrderPage;
