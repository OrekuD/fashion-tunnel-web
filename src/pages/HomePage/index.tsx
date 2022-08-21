import React from "react";
import { useDispatch } from "react-redux";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const HomePage = () => {
  const { user, ui, products, request } = useSelectState();

  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    dispatch(productsAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.index.typePrefix)) {
      RM.consume(productsAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.index.typePrefix)) {
      RM.consume(productsAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

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
