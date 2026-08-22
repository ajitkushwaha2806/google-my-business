export const APPLY_TO_OPTIONS = [
  { label: "Entire Menu", value: "entire_menu" },
  { label: "Selected Items", value: "selected_items" },
];

export const ACTION_OPTIONS = [
  { label: "+", value: "increase" },
  { label: "-", value: "decrease" },
];

export const TYPE_OPTIONS = [
  { label: "%", value: "percentage" },
  { label: "Flat", value: "flat" },
];

export const ROUNDING_OPTIONS = [
  { value: "none", label: "No Rounding" },
  { value: "round_to_9", label: "Simply Round to 9 (e.g. ₹300 → ₹299)" },
  { value: "round_to_10", label: "Round to nearest 10 (e.g. ₹294 → ₹290)" },
];
