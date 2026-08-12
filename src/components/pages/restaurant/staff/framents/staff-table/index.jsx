"use client";
import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useStaff } from "@/store/hooks/useStaff";
import { getStaffTableColumns } from "./helper/index";
import { DataTable } from "@/components/ui/data-table";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";

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
            <DataTable 
                columns={columns}
                data={staffList}
                isLoading={isLoading}
                error={error}
                emptyState={emptyState}
            />
            
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
