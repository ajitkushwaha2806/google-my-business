import { format } from "date-fns";
import Loader from "@/components/global/loader";
import { Receipt, MapPin, Hash, Eye, Inbox } from "lucide-react";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "../helpers/constants";

export const StatusBadge = ({ status }) => {
    const cfg = ORDER_STATUS_CONFIG[status] || { label: status, badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

export const PaymentBadge = ({ status }) => {
    const cfg = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${cfg.badge}`}>
            {cfg.label}
        </span>
    );
};

const OrderTable = ({ orders, total, page, limit, onPageChange, isLoading, onViewOrder }) => {
    const totalPages = Math.ceil(total / limit) || 1;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let startPage = Math.max(1, page - 2);
            let endPage = Math.min(totalPages, page + 2);
            
            if (page <= 3) {
                endPage = 5;
            } else if (page >= totalPages - 2) {
                startPage = totalPages - 4;
            }
            
            for (let i = startPage; i <= endPage; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/50">
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Status</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</th>
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="p-16">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-16">
                                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center">
                                            <Inbox size={24} className="text-gray-300 dark:text-zinc-600" />
                                        </div>
                                        <p className="text-sm font-medium">No orders found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-500">
                                                <Receipt size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                                                    <Hash size={12} className="text-gray-400" />
                                                    {order.orderNumber}
                                                </div>
                                                <div className="text-[11px] text-gray-500">{order.items?.length || 0} items</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-5 py-4">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {format(new Date(order.createdAt), "hh:mm a")}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 capitalize font-medium">
                                            {order.orderType === "dine-in" ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    Dine-in
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                    {order.orderType}
                                                </div>
                                            )}
                                        </div>
                                        {order.table && (
                                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                                                <MapPin size={10} />
                                                Table {order.table.tableNumber}
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        {order.customer ? (
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer.name || "Guest"}</div>
                                                <div className="text-[11px] text-gray-500">{order.customer.phone || "-"}</div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">Walk-in</div>
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>

                                    <td className="px-5 py-4">
                                        {order.paymentStatus && <PaymentBadge status={order.paymentStatus} />}
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                            ₹{order.totalAmount?.toFixed(2)}
                                        </div>
                                        <div className="text-[11px] text-gray-500 uppercase">
                                            {order.paymentMethod || "CASH"}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <button
                                            onClick={() => onViewOrder(order)}
                                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && total > 0 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/50">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{(page - 1) * limit + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(page * limit, total)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{total}</span> results
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900"
                        >
                            Previous
                        </button>
                        
                        {getPageNumbers().map((p) => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center border ${
                                    page === p 
                                    ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-600" 
                                    : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTable;
