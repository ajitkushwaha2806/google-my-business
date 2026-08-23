export const ORDER_STATUS_CONFIG = {
    PENDING_PAYMENT: { label: "Pending Payment", badge: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300", dot: "bg-gray-500" },
    PLACED: { label: "Placed", badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400", dot: "bg-blue-500" },
    ACCEPTED: { label: "Accepted", badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400", dot: "bg-indigo-500" },
    PREPARING: { label: "Preparing", badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400", dot: "bg-orange-500" },
    READY_FOR_PICKUP: { label: "Ready", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400", dot: "bg-amber-500" },
    PICKED_UP: { label: "Picked Up", badge: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400", dot: "bg-teal-500" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400", dot: "bg-cyan-500" },
    DELIVERED: { label: "Delivered", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400", dot: "bg-emerald-500" },
    CANCELLED: { label: "Cancelled", badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400", dot: "bg-red-500" },
    REJECTED: { label: "Rejected", badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400", dot: "bg-rose-500" }
};

export const ORDER_TAB_FILTERS = [
    { key: "all", label: "All Orders", statuses: [] },
    { key: "active", label: "Active", statuses: ["PLACED", "ACCEPTED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] },
    { key: "completed", label: "Completed", statuses: ["PICKED_UP", "DELIVERED"] },
    { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED", "REJECTED"] }
];

export const PAYMENT_STATUS_CONFIG = {
    pending: { label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400" },
    completed: { label: "Paid", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400" },
    failed: { label: "Failed", badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400" },
    refunded: { label: "Refunded", badge: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-gray-300" }
};
