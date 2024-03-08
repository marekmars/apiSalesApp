export interface ActionValue<T> {
  value: boolean;
  action: "edit" | "delete" | "create" | "detail"| "";
  item: T | null;
}
