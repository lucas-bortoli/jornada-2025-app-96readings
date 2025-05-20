export type DatasetX = [number, number, number, number, number];
export type DatasetY = string;
export type DatasetRow = [...DatasetX, DatasetY];

export type DatasetYEncoded = number;
export type DatasetRowEncoded = [...DatasetX, DatasetYEncoded];

export const X = (xyRow: DatasetRow | DatasetRowEncoded) => xyRow.slice(0, 5) as DatasetX;
export const y = <R extends DatasetRow | DatasetRowEncoded>(xyRow: R) => xyRow[5] as R[5];
