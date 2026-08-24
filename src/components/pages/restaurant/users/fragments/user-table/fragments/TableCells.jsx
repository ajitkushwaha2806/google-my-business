import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import { Edit2, Phone, Trash2 } from "lucide-react";

export const UserProfileCell = ({ user }) => (
    <div className="flex items-center gap-3.5 min-w-0 w-full">
        <div className="w-11 h-11 rounded-md overflow-hidden shrink-0 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <img 
                src={getImageUrl(user.image, true, "thumbnail") || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.phone}&backgroundColor=f1f5f9`} 
                alt={user.name} 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex flex-col min-w-0 gap-0.5 flex-1">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px] truncate">{user.name}</span>
            <div className="flex items-center gap-1">
                <Phone size={12} className="text-gray-400" />
                <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 truncate">{user.phone}</span>
            </div> 
        </div>
    </div>
);

export const UserStatusCell = ({ user }) => {
    const status = user.status || "ACTIVE";
    switch (status) {
        case "ACTIVE":
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50/80 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/60 dark:border-green-500/20 shadow-sm w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Active</span>
                </div>
            );
        case "INACTIVE":
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20 shadow-sm w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Inactive</span>
                </div>
            );
        case "BLOCKED":
            return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50/80 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-500/20 shadow-sm w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">Blocked</span>
                </div>
            );
        default:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                    <span className="text-[11px] font-bold tracking-wide">{status}</span>
                </div>
            );
    }
};

export const UserJoinedCell = ({ user }) => {
    if (!user.createdAt) return <span>-</span>;
    let date = "";
    let time = "";
    try {
        date = format(new Date(user.createdAt), "dd MMM yyyy");
        time = format(new Date(user.createdAt), "hh:mm a");
    } catch {
        return <span>-</span>;
    }

    return (
        <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{date}</span>
            <span className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {time}
            </span>
        </div>
    );
};

export const UserActionsCell = ({ user, onEdit, onDelete }) => (
    <div className="flex justify-end items-center gap-2">
        <button 
            onClick={() => onEdit(user)}
            className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-md transition-colors focus:outline-none"
            title="Edit User Details"
        >
            <Edit2 size={16} strokeWidth={2} />
        </button>
        <button 
            onClick={() => onDelete(user)}
            className="p-1.5 text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md transition-colors focus:outline-none"
            title="Delete User"
        >
            <Trash2 size={16} strokeWidth={2} />
        </button>
    </div>
);
