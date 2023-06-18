export type viewTypes = "Active" | "Closed" | "Liquidated";

export type VoidNoArgs = () => void;
export interface PositionsDetailItemType {
  title: string;
  value: string;
  unit?: string;
}

export type Address = `0x${string}`;
