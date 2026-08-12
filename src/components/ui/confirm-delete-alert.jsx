"use client";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmDeleteAlert({ isOpen, onClose, onConfirm, title, description, isDeleting }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div 
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex flex-col items-center text-center p-6 pt-8">
                    <div className="w-14 h-14 rounded-md bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5 border border-red-100 dark:border-red-500/20">
                        <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" strokeWidth={2} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title || "Are you absolutely sure?"}</h2>
                    <p className="text-[14px] leading-relaxed text-gray-500 dark:text-gray-400 mt-2 px-2">
                        {description || "This action cannot be undone. This will permanently delete the selected item and remove its data from our servers."}
                    </p>
                </div>
                 
                <div className="flex items-center gap-3 p-4 bg-gray-50/80 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 text-[14px] shadow-sm active:scale-[0.98]"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-sm text-[14px] active:scale-[0.98]"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
