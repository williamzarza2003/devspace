export const CATEGORIES = [
  "LENGUAJE",
  "FRAMEWORK",
  "HERRAMIENTA",
  "BASE DE DATOS",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Technology = {
  label: string;
  title: string;
  description: string;
};

export type NotificationData = {
  message: string;
  type: "success" | "error" | "info";
};

export type PendingConfirmation = {
  title: string;
  message: string;
  action: "delete" | "reset";
  technologyTitle?: string;
};

export const SORT_ORDERS = ["default", "az", "za", "category"] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export function isSortOrder(value: unknown): value is SortOrder {
  return (
    typeof value === "string" &&
    (SORT_ORDERS as readonly string[]).includes(value)
  );
}

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}
