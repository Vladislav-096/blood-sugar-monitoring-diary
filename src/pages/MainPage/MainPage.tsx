// import { v7 as uuidv4 } from "uuid";
import { DiaryTable } from "../../features/diaryTable/DiaryTable";

export const MainPage = () => {
  // const id = uuidv4();

  return (
    <section>
      <div className="container">
        <DiaryTable />
      </div>
    </section>
  );
};
