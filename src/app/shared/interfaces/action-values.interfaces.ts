export interface ActionValue<T> {
  value: boolean;
  action: "edit" | "delete" | "create" | "";
  item: T | null;
}
