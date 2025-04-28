import { loaderDefaultColor } from "../../constants/constants";
import styles from "./loader.module.scss";
interface Loader {
  lineColor?: string;
}

export const Loader = ({ lineColor = loaderDefaultColor }: Loader) => {
  const length = 12;

  return (
    <div className={styles.wrapper}>
      {Array.from({ length }).map((_, index) => (
        <div
          style={{ "--line-color": lineColor } as React.CSSProperties} // Типизация для TS
          key={index}
          className={styles.line}
        ></div>
      ))}
    </div>
  );
};
