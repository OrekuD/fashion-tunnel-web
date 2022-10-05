import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import { FilterIcon } from "../../components/Icons";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import ProductCategories from "../../namespace/ProductCategories";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const CategoryPage = () => {
  const { products } = useSelectState();
  const [searchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<ProductCategories.Status>(
      searchParams.get("q") ? Number(searchParams.get("q")) : -1
    );

  const categoryProducts = React.useMemo(() => {
    if (selectedCategoryId < 0) {
      return products.list;
    }
    return products.list.filter(
      ({ productCategory }) => productCategory === selectedCategoryId
    );
  }, [products.list, selectedCategoryId]);

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["title-section"]}>
          <p className={classes["title"]}>
            {selectedCategoryId < 0
              ? "All products"
              : ProductCategories.State.text(selectedCategoryId)}
          </p>
          <p className={classes["sub-title"]}>
            {categoryProducts.length === 1
              ? "1 item"
              : `${categoryProducts.length} items`}
          </p>
          <div className={classes["categories"]}>
            {/* <button
              className={classes["tab"]}
              style={{
                borderLeft: "1px solid rgba(41, 37, 37, 0.1)",
                width: 50,
                minWidth: 50,
                marginRight: 12,
              }}
            >
              <FilterIcon width={24} height={24} color={colors.deepgrey} />
            </button> */}
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

        <div className={classes["list"]}>
          {/* {categoryProducts.length} */}
          {categoryProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
