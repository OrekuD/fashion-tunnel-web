import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../../components";
import Header from "../../components/Header";
import { ArrowRightIcon, SearchIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import { useWindowResize } from "../../hooks/useWindowResize";
import ProductCategories from "../../namespace/ProductCategories";
import classes from "./index.module.scss";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();
  const { isSmallDevice } = useWindowResize();

  const categories = React.useMemo(
    () => [
      {
        id: ProductCategories.Status.TSHIRT,
        name: "t-shirt",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c2hpcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60",
      },
      {
        id: ProductCategories.Status.SHOES,
        name: "shoes",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
      },
      {
        id: ProductCategories.Status.HOODIE,
        name: "hoodie",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aG9vZGllfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
      },
      {
        id: ProductCategories.Status.DRESSES,
        name: "dresses",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1494578379344-d6c710782a3d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      },
      {
        id: ProductCategories.Status.TROUSERS,
        name: "trousers",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dHJvdXNlcnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
      },
      {
        id: ProductCategories.Status.JACKET,
        name: "jacket",
        productsLength: 3,
        uri: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8amFja2V0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      },
    ],
    []
  );

  const search = () => {
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["search-container"]}>
          <TextInput
            onChange={setSearchQuery}
            placeholder="Search Product"
            value={searchQuery}
            rounded
            style={{
              marginBottom: isSmallDevice ? "1rem" : "2rem",
            }}
            leftIcon={
              <SearchIcon
                width={24}
                height={24}
                color={colors.deepgrey}
                style={{ marginRight: 12 }}
              />
            }
            type="text"
          />
          <button
            className={classes["search-button"]}
            onClick={search}
            disabled={!searchQuery}
          >
            <p>Search</p>
            <ArrowRightIcon
              width={24}
              height={24}
              color={colors.white}
              style={{ marginLeft: 12 }}
            />
          </button>
        </div>
        <div className={classes["list"]}>
          {categories.map((category, index) => (
            <Link
              to={`/categories?q=${category.id}`}
              className={classes["category"]}
              key={index}
            >
              <img
                src={category.uri}
                alt={category.name}
                className={classes["image"]}
              />
              <div className={classes["gradient"]}>
                <p className={classes["name"]}>{category.name}</p>
                {/* <p className={classes["products-length"]}>
                  {category.productsLength} products
                </p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
