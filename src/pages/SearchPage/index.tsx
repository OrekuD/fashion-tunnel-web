import React from "react";
import { useDispatch } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Header from "../../components/Header";
import { FilterIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import ProductCategories from "../../namespace/ProductCategories";
import productsAsyncActions from "../../store/actions/products.action";
import searchAsyncActions from "../../store/actions/search.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { searchActions } from "../../store/slices/search.slice";
import classes from "./index.module.scss";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<ProductCategories.Status>();
  const [isLoading, setIsLoading] = React.useState(true);
  const { request, search } = useSelectState();

  const [updatedAt] = React.useState(request.updatedAt);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const query = searchParams.get("q");

    if (!query) {
      navigate(-1);
      return;
    }
    dispatch(searchAsyncActions.index({ query }));
  }, []);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(searchAsyncActions.index.typePrefix)) {
      RM.consume(searchAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isPending(searchAsyncActions.index.typePrefix)) {
      setIsLoading(true);
      return;
    }

    if (RM.isRejected(searchAsyncActions.index.typePrefix)) {
      RM.consume(searchAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const categoryProducts = React.useMemo(() => {
    if (!selectedCategoryId) {
      return search.list;
    }
    return search.list.filter(
      ({ productCategory }) => productCategory === selectedCategoryId
    );
  }, [search.list, selectedCategoryId]);

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["title-section"]}>
          <p className={classes["title"]}>
            {!selectedCategoryId
              ? searchParams.get("q")
                ? `All results - ${searchParams.get("q")}`
                : ""
              : ProductCategories.State.text(selectedCategoryId)}
          </p>
          <p className={classes["sub-title"]}>
            {categoryProducts.length === 1
              ? "1 item"
              : `${categoryProducts.length} items`}
          </p>
          <div className={classes["categories"]}>
            <button
              className={classes["tab"]}
              style={{
                borderLeft: "1px solid rgba(41, 37, 37, 0.1)",
                width: 50,
                minWidth: 50,
                marginRight: 12,
              }}
            >
              <FilterIcon width={24} height={24} color={colors.deepgrey} />
            </button>
            <div className={classes["tabs"]}>
              {ProductCategories.State.list().map((productCategory, index) => {
                const isActiveCategory = selectedCategoryId === productCategory;
                return (
                  <button
                    className={classes["tab"]}
                    style={{
                      backgroundColor: isActiveCategory
                        ? "rgba(41, 37, 37, 0.05)"
                        : colors.white,
                      borderLeft:
                        index === 0
                          ? "1px solid rgba(41, 37, 37, 0.1)"
                          : undefined,
                    }}
                    disabled={search.list.length === 0}
                    onClick={() =>
                      setSelectedCategoryId(
                        isActiveCategory ? -1 : productCategory
                      )
                    }
                    key={index}
                  >
                    <p color={colors.deepgrey}>
                      {ProductCategories.State.text(productCategory)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className={classes["loading"]}>
            <Loader color={colors.deepgrey} />
          </div>
        ) : (
          <>
            {categoryProducts.length === 0 ? (
              <p className={classes["no-results"]}>
                {search.list.length === 0
                  ? "No results for your search"
                  : "No results for this category"}
              </p>
            ) : (
              <div className={classes["list"]}>
                {categoryProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
