import styles from "./loader.module.scss";
interface Loader {
  lineColor?: string;
}

export const Loader = ({ lineColor = "#f0f6fc" }: Loader) => {
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
