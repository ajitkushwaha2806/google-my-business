"use client";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useStaff } from "@/store/hooks/useStaff";
import { getStaffTableColumns } from "./helper/index";
import { DataTable } from "@/components/ui/data-table";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";
import { StaffProfileCell, StaffRoleCell, StaffStatusCell, StaffJoinedCell, StaffActionsCell } from "./fragments/TableCells";

const StaffCard = ({ staff, onEdit, onDelete }) => (
    <div className="flex flex-col p-4 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
        <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
                <StaffProfileCell staff={staff} />
            </div>
            <div className="shrink-0">
                <StaffActionsCell staff={staff} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
            <StaffRoleCell staff={staff} />
            <StaffStatusCell staff={staff} />
            <div className="ml-auto text-right [&>div]:items-end">
                <StaffJoinedCell staff={staff} />
            </div>
        </div>
    </div>
);

export default function StaffTable({ staffList, isLoading, error, onEdit }) {
    const [staffToDelete, setStaffToDelete] = useState(null);
    const { restaurantId } = useRestaurant();
    const { deleteStaff, isDeleting } = useStaff(restaurantId);

    const handleDelete = async () => {
        if (!staffToDelete) return;
        await deleteStaff(staffToDelete._id);
        setStaffToDelete(null);
    };

    const emptyState = {
        title: "No Staff Found",
        description: "You haven't added any staff members yet. Add them to manage their roles and access.",
        icon: <Users size={24} className="text-gray-400" />
    };

    const columns = useMemo(() => getStaffTableColumns(onEdit, setStaffToDelete), [onEdit]);

    return (
        <>
            <div className="hidden md:block">
                <DataTable 
                    columns={columns}
                    data={staffList}
                    isLoading={isLoading}
                    error={error}
                    emptyState={emptyState}
                />
            </div>
            
            <div className="md:hidden flex flex-col gap-3 p-1 pb-10">
                {staffList?.length > 0 ? (
                    staffList.map(staff => (
                        <StaffCard 
                            key={staff._id} 
                            staff={staff} 
                            onEdit={onEdit} 
                            onDelete={setStaffToDelete} 
                        />
                    ))
                ) : !isLoading && (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                        {emptyState.icon}
                        <h3 className="mt-4 font-semibold text-gray-900 dark:text-gray-100">{emptyState.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{emptyState.description}</p>
                    </div>
                )}
            </div>
            <ConfirmDeleteAlert 
                isOpen={!!staffToDelete}
                onClose={() => setStaffToDelete(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Staff Member?"
                description={`Are you sure you want to permanently remove ${staffToDelete?.name}?`}
            />
        </>
    );
}
