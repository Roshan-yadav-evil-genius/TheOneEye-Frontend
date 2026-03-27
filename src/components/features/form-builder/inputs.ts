export type TWidgetType = "text" | "textarea" | "number" | "email" | "select" | "checkbox";

export type TWidgetConfig = {
  id: string;
  type: TWidgetType;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
};
