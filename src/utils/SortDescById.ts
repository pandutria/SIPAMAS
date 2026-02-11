/* eslint-disable @typescript-eslint/no-explicit-any */
export const SortDescById = (data: any) => {
  return [...data].sort((a, b) => b.id - a.id);
};
