import { Edit2, Phone, Trash2, ShieldCheck } from "lucide-react";
import { getStatusBadge } from "../helper/constants";
import { formatDate } from "../helper/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export const StaffProfileCell = ({ staff }) => (
    <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-md overflow-hidden shrink-0 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <img 
                src={staff.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${staff.name}&backgroundColor=f1f5f9`} 
                alt={staff.name} 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex flex-col min-w-0 gap-0.5">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px]">{staff.name}</span>
            <div className="flex items-center gap-1">
                <span className="text-[13px] font-medium text-blue-600 dark:text-blue-400 truncate">{staff.email}</span>
                {staff.phone && <Phone size={12} className="text-green-500 ml-1" />}
            </div>
        </div>
    </div>
);

export const StaffRoleCell = ({ staff }) => (
    <div className="flex flex-col min-w-0">
        <TooltipProvider delay={0}>
            <Tooltip>
                <TooltipTrigger>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/60 dark:border-orange-500/20 rounded-md shadow-sm w-fit uppercase tracking-widest cursor-help">
                        <ShieldCheck size={14} className="text-orange-500" strokeWidth={2.5} />
                        {staff.role?.name || "Unassigned"}
                    </span>
                </TooltipTrigger>
                
                {staff.role?.permissions && staff.role.permissions.length > 0 && (
                    <TooltipContent 
                        side="bottom" 
                        align="start" 
                        sideOffset={8}
                        className="[&>svg]:hidden !flex-col !items-start !bg-white !text-gray-900 dark:!bg-zinc-950 dark:!text-gray-100 border border-gray-200 dark:border-zinc-800 rounded-md shadow-xl min-w-[220px] max-w-[280px] z-[100] !p-0"
                    >
                        <div className="flex flex-col p-3 w-full h-full">
                            <div className="flex items-center mb-2 pb-2 border-b border-gray-100 dark:border-zinc-800 w-full">
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-widest">
                                    Active Permissions
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full mt-1">
                                {staff.role.permissions.map((perm, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-sm bg-orange-500 shrink-0"></div>
                                        <span className="text-[11px] font-semibold tracking-wide">{perm.code ? perm.code.replace(/_/g, ' ') : "UNKNOWN"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    </div>
);

export const StaffStatusCell = ({ staff }) => getStatusBadge(staff.status);

export const StaffJoinedCell = ({ staff }) => {
    const joined = formatDate(staff.createdAt);
    return (
        <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{joined.date}</span>
            <span className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {joined.time}
            </span>
        </div>
    );
};

export const StaffActionsCell = ({ staff, onEdit, onDelete }) => (
    <div className="flex justify-end items-center gap-2">
        <button 
            onClick={() => onEdit(staff)}
            className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
            title="Edit Staff Details"
        >
            <Edit2 size={16} strokeWidth={2} />
        </button>
        <button 
            onClick={() => onDelete(staff)}
            className="p-1.5 text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
            title="Delete Staff"
        >
            <Trash2 size={16} strokeWidth={2} />
        </button>
    </div>
);
