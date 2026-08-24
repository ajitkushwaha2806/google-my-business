import { format } from "date-fns";
import { StatusBadge, PaymentBadge } from "./order-table";
import { ORDER_STATUS_CONFIG } from "../helpers/constants";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, Printer, Receipt as ReceiptIcon, CheckCircle2, XCircle, Clock, User, Phone, Mail } from "lucide-react";

const OrderTimeline = ({ statusHistory = [], createdAt, currentStatus }) => {
    if (!statusHistory || statusHistory.length === 0) {
        return (
            <div className="flex items-center justify-between relative px-2 mt-4">
                <div className="flex flex-col items-center gap-2 bg-white dark:bg-zinc-900 px-2">
                    <CheckCircle2 size={24} className="text-green-500 bg-white dark:bg-zinc-900 rounded-full" />
                    <div className="text-center">
                        <div className="text-[11px] font-medium text-gray-500">Placed</div>
                        <div className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{format(new Date(createdAt), "hh:mm a")}</div>
                    </div>
                </div>
            </div>
        );
    }

    const sortedHistory = [...statusHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div className="flex relative mt-4 overflow-x-auto no-scrollbar pb-2">
            {sortedHistory.map((historyItem, index) => {
                const isLast = index === sortedHistory.length - 1;
                const isRejected = historyItem.status === 'REJECTED' || historyItem.status === 'CANCELLED';
                const isCompleted = historyItem.status === 'DELIVERED' || historyItem.status === 'PICKED_UP';
                const isCurrent = isLast;
                
                let Icon = Clock;
                let iconColor = "text-gray-400 bg-white dark:bg-zinc-900";
                let lineColor = "bg-green-500";
                
                if (isRejected) {
                    Icon = XCircle;
                    iconColor = "text-red-500 bg-white dark:bg-zinc-900";
                    lineColor = "bg-red-500";
                } else if (isCompleted || !isLast) {
                    Icon = CheckCircle2;
                    iconColor = "text-green-500 bg-white dark:bg-zinc-900";
                } else {
                    Icon = Clock;
                    iconColor = "text-blue-500 bg-white dark:bg-zinc-900";
                }
                
                const label = ORDER_STATUS_CONFIG[historyItem.status]?.label || historyItem.status;

                return (
                    <div key={index} className="flex flex-col items-center relative flex-1 min-w-[72px] shrink-0">
                        {/* Connecting Line */}
                        {!isLast && (
                            <div className={`absolute top-3 left-1/2 w-full h-[2px] z-0 ${lineColor}`} />
                        )}
                        
                        <div className="bg-white dark:bg-zinc-900 px-1 relative z-10">
                            <Icon size={24} className={`rounded-full ${iconColor}`} />
                        </div>
                        
                        <div className="text-center mt-2 px-1">
                            <div className="text-[11px] font-medium text-gray-500 leading-tight">{label}</div>
                            <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
                                {format(new Date(historyItem.timestamp), "hh:mm a")}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const OrderDetailsDrawer = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:max-w-md p-3 flex flex-col bg-gray-100 dark:bg-zinc-950/50 border-l border-gray-200 dark:border-zinc-800 shadow-md">
                <div className="flex justify-between rounded-md items-center bg-white dark:bg-zinc-900 px-6 py-5 border-b border-gray-200 shrink-0">
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Order Details</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10">
                    <div className="bg-white dark:bg-zinc-900 p-6 shadow-sm border-b border-gray-200 dark:border-zinc-800">
                        <div className="flex justify-between items-start">
                            <div className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                                ID: {order.orderNumber}
                            </div>
                            <div className="text-[13px] text-gray-500 font-medium">
                                {format(new Date(order.createdAt), "hh:mm a | dd MMMM")}
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                                <User size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {order.customer ? order.customer.name : "Guest Customer"}
                                </span>
                            </div>
                            {order.customer?.phone && (
                                <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                                    <Phone size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                    <span>{order.customer.phone}</span>
                                </div>
                            )}
                            {order.customer?.email && (
                                <div className="flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400">
                                    <Mail size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                                    <span>{order.customer.email}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 flex items-center gap-3 border-t border-gray-100 dark:border-zinc-800">
                            <StatusBadge status={order.status} />
                            <span className="text-[13px] text-gray-500 font-medium capitalize flex items-center gap-1.5">
                                {order.orderType} 
                                {order.table && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /> 
                                        Table {order.table.tableNumber} {order.table.zone ? `(${order.table.zone})` : ''}
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 shadow-sm border-y border-gray-200 dark:border-zinc-800">
                        <h3 className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-2">Order Timeline</h3>
                        <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} createdAt={order.createdAt} />
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 shadow-sm border-y border-gray-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3 mb-4">
                            <h3 className="text-[11px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Order Details</h3>
                            <div className="flex gap-2">
                                <button className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2.5 py-1 text-[11px] font-bold tracking-wide flex items-center gap-1.5 transition-colors">
                                    <Printer size={12} strokeWidth={2.5} /> KOT
                                </button>
                                <button className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-2.5 py-1 text-[11px] font-bold tracking-wide flex items-center gap-1.5 transition-colors">
                                    <ReceiptIcon size={12} strokeWidth={2.5} /> BILL
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 leading-snug">
                                            {item.quantity} x <span className="border-b border-dashed border-gray-400 dark:border-gray-600">{item.name}</span>
                                        </div>
                                        {item.variant?.name && (
                                            <div className="text-[12px] text-gray-500 mt-0.5">Variant: {item.variant.name}</div>
                                        )}
                                        {item.addons?.length > 0 && (
                                            <div className="text-[12px] text-gray-500 mt-0.5">Add-ons: {item.addons.map(a => a.name).join(", ")}</div>
                                        )}
                                        {item.specialInstructions && (
                                            <div className="text-[12px] text-orange-600 dark:text-orange-400 mt-1 italic">
                                                Note: {item.specialInstructions}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 shrink-0">
                                        ₹{item.totalPrice?.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 dark:border-zinc-800 mt-5 pt-4 space-y-2.5 text-[13px] text-gray-500 dark:text-gray-400">
                            <div className="flex justify-between items-center">
                                <span>{order.items?.length || 0} items (Subtotal)</span>
                                <span>₹{order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-4">
                                <span className="border-b border-dashed border-gray-300 dark:border-zinc-600">Taxes & Fees</span>
                                <span>₹{(order.totalAmount - order.subtotal)?.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Total Bill</span>
                                    {order.paymentStatus && <PaymentBadge status={order.paymentStatus} />}
                                </div>
                                <span className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
                                    ₹{order.totalAmount?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
};

export default OrderDetailsDrawer;
