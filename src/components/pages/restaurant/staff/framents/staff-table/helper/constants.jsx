export const getStatusBadge = (status) => {
        switch(status) {
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
            case "SUSPENDED":
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50/80 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-500/20 shadow-sm w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-widest">Suspended</span>
                    </div>
                );
            case "DISABLED":
                return (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50/80 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-400 border border-gray-200/60 dark:border-zinc-700/50 shadow-sm w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-widest">Disabled</span>
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
}
    
