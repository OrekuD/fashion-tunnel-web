import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import favouritesAsyncActions from "../../store/actions/favourites.action";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const WishlistPage = () => {
  const { request, favourites, authentication } = useSelectState();

  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    if (!authentication.isAuthenticated) return;
    dispatch(favouritesAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(favouritesAsyncActions.index.typePrefix)) {
      RM.consume(favouritesAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(favouritesAsyncActions.index.typePrefix)) {
      RM.consume(favouritesAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        {authentication.isAuthenticated ? (
          <>
            {favourites.list.length === 0 ? (
              <div className={classes["empty"]}>
                <p className={classes["label"]}>Your wishlist is empty</p>
                <Button label="Explore" onClick={() => navigate("/explore")} />
              </div>
            ) : (
              <>
                <div className={classes["title-section"]}>
                  <p className={classes["title"]}>Wishlist</p>
                  <p className={classes["sub-title"]}>
                    {favourites.list.length === 1
                      ? "1 item"
                      : `${favourites.list.length} items`}
                  </p>
                </div>
                <div className={classes["list"]}>
                  {favourites.list.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className={classes["empty"]}>
              <p className={classes["label"]}>Your wishlist is empty</p>
              <p className={classes["description"]}>
                Sign in to view your previously saved items
              </p>
              <Button label="Sign in" onClick={() => navigate("/sign-in")} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
