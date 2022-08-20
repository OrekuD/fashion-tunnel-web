import React from "react";
import { useDispatch } from "react-redux";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import productsAsyncActions from "../../store/actions/products.action";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const HomePage = () => {
  const { user, ui, products } = useSelectState();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(productsAsyncActions.index());
  }, []);

  React.useEffect(() => {
    console.log({ p: products.list[0] });
  }, [products]);

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["list"]}>
          {products.list.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
