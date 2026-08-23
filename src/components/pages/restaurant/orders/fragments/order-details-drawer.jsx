import { format } from "date-fns";
import { StatusBadge, PaymentBadge } from "./order-table";
import { Receipt, X, MapPin, Phone, Mail, Hash, User, UtensilsCrossed } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const OrderDetailsDrawer = ({ isOpen, onClose, order, onUpdate }) => {
    if (!order) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-gray-50 dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800">
                <SheetHeader className="p-5 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                <Receipt size={18} className="text-orange-500" />
                                Order #{order.orderNumber}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-gray-500 mt-1">
                                Placed on {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                            </SheetDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <StatusBadge status={order.status} />
                        {order.paymentStatus && <PaymentBadge status={order.paymentStatus} />}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                    <div className="space-y-6 pb-20">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer</h3>
                                {order.customer ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                            <User size={14} className="text-gray-400" />
                                            {order.customer.name}
                                        </div>
                                        {order.customer.phone && (
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Phone size={14} className="text-gray-400" />
                                                {order.customer.phone}
                                            </div>
                                        )}
                                        {order.customer.email && (
                                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                                <Mail size={14} className="text-gray-400" />
                                                {order.customer.email}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">Guest / Walk-in</div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Info</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium capitalize">
                                        <UtensilsCrossed size={14} className="text-gray-400" />
                                        {order.orderType}
                                    </div>
                                    {order.table && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin size={14} className="text-gray-400" />
                                            Table {order.table.tableNumber}
                                        </div>
                                    )}
                                    {order.table?.zone && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Hash size={14} className="text-gray-400" />
                                            {order.table.zone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Items</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="p-4 flex gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {item.quantity}x
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{item.totalPrice?.toFixed(2)}</span>
                                            </div>
                                            
                                            {item.variant?.name && (
                                                <div className="text-xs text-gray-500">Variant: {item.variant.name}</div>
                                            )}
                                            
                                            {item.addons?.length > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    Add-ons: {item.addons.map(a => a.name).join(", ")}
                                                </div>
                                            )}
                                            
                                            {item.specialInstructions && (
                                                <div className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/30 p-2 rounded mt-2 italic border border-orange-100 dark:border-orange-900/50">
                                                    " {item.specialInstructions} "
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Taxes & Fees</span>
                                <span>₹{(order.totalAmount - order.subtotal)?.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Amount</span>
                                <span className="text-lg font-black text-orange-600 dark:text-orange-500">₹{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default OrderDetailsDrawer;
