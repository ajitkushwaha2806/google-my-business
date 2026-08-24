import { format } from "date-fns";
import Loader from "@/components/global/loader";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "../helpers/constants";
import { Receipt, MapPin, Hash, Eye, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

export const StatusBadge = ({ status }) => {
    const cfg = ORDER_STATUS_CONFIG[status] || { label: status, badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" };
    return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

export const PaymentBadge = ({ status }) => {
    const cfg = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase ${cfg.badge}`}>
            {cfg.label}
        </span>
    );
};

const OrderCard = ({ order, onViewOrder }) => {
    return (
        <div className="p-3 flex flex-col gap-4 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 rounded-2xl hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-sm transition-all">
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/50 mt-0.5">
                        <Receipt size={18} className="text-orange-600 dark:text-orange-500" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-gray-100 text-[15px] truncate">
                            <Hash size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate whitespace-nowrap">{order.orderNumber}</span>
                        </div>
                        <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 capitalize truncate">
                            {order.items?.length || 0} items • {order.orderType === "dine-in" ? `Table ${order?.table?.tableNumber || "-"}` : order.orderType}
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="font-extrabold text-gray-900 dark:text-gray-100 text-base">
                        ₹{order.totalAmount?.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-gray-400 uppercase mt-1 font-semibold tracking-wide">
                        {order.paymentMethod || "CASH"}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={order.status} />
                    {order.paymentStatus && <PaymentBadge status={order.paymentStatus} />}
                </div>
                <div className="text-right flex flex-col items-end shrink-0 pl-2">
                    <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                        {format(new Date(order.createdAt), "hh:mm a")}
                    </span>
                </div>
            </div>

            <div className="pt-2">
                <button 
                    onClick={() => onViewOrder(order)}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-md text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98]"
                >
                    View Details
                    <ChevronRight size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
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
        <div className="bg-transparent md:bg-white md:dark:bg-zinc-900 md:rounded-2xl md:border border-gray-200 dark:border-zinc-800/80 md:shadow-sm flex flex-col">
            <div className="hidden md:block overflow-x-auto min-h-[400px]">
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

            <div className="flex flex-col md:hidden gap-3 min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-16">
                        <Loader />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 gap-3 text-gray-400">
                        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-800/50 flex items-center justify-center">
                            <Inbox size={24} className="text-gray-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-sm font-medium">No orders found.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard key={order._id} order={order} onViewOrder={onViewOrder} />
                    ))
                )}
            </div>

            {!isLoading && total > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between px-2 md:px-5 py-4 md:py-3 gap-4 md:border-t border-gray-100 dark:border-zinc-800/80 md:bg-gray-50/50 md:dark:bg-zinc-900/50 mt-2 md:mt-0">
                    <p className="text-sm md:text-xs text-gray-500 text-center md:text-left">
                        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{(page - 1) * limit + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(page * limit, total)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{total}</span> results
                    </p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className="p-1.5 md:px-3 md:py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900 flex items-center justify-center"
                        >
                            <ChevronLeft size={18} />
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
                            className="p-1.5 md:px-3 md:py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900 flex items-center justify-center"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTable;
