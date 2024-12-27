import { filters } from "../app/measurements";

export function formatDateRange(dateRangeObj: filters) {
  return `createdAt_gte=${dateRangeObj.createdAt_gte}&createdAt_lte=${dateRangeObj.createdAt_lte}`;
}
