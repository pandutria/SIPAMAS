/* eslint-disable @typescript-eslint/no-explicit-any */
export const ParseNumber = (value: any): number => {
  if (value == null) return 0;

  return Number(
    String(value).replace(/[^0-9]/g, '')
  ) || 0;
};
