"use client";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useUsers } from "@/store/hooks/useUsers";
import { getUserTableColumns } from "./helper/index";
import { DataTable } from "@/components/ui/data-table";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";

export default function UserTable({ userList, isLoading, error, onEdit }) {
    const [userToDelete, setUserToDelete] = useState(null);
    const { restaurantId } = useRestaurant();
    const { deleteUser, isDeleting } = useUsers(restaurantId);

    const handleDelete = async () => {
        if (!userToDelete) return;
        await deleteUser(userToDelete._id);
        setUserToDelete(null);
    };

    const emptyState = {
        title: "No Users Found",
        description: "You haven't got any registered customers yet.",
        icon: <Users size={24} className="text-gray-400" />
    };

    const columns = useMemo(() => getUserTableColumns(onEdit, setUserToDelete), [onEdit]);

    return (
        <>
            <DataTable 
                columns={columns}
                data={userList}
                isLoading={isLoading}
                error={error}
                emptyState={emptyState}
            />
            
            <ConfirmDeleteAlert 
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Customer?"
                description={`Are you sure you want to permanently remove ${userToDelete?.name}?`}
            />
        </>
    );
}
