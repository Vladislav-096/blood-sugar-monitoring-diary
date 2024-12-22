import { v7 as uuidv4 } from "uuid";

export const MainPage = () => {
  const id = uuidv4();

  return (
    <section>
      <div className="container">{id}</div>
    </section>
  );
};
