import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import colors from "../../constants/colors";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const HomePage = () => {
  const { user, ui } = useSelectState();

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["list"]}>
          {Array(20)
            .fill("9")
            .map((_, index) => (
              <ProductCard key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
