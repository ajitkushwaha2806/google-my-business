"use client";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useUsers } from "@/store/hooks/useUsers";
import { getUserTableColumns } from "./helper/index";
import { DataTable } from "@/components/ui/data-table";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import { ConfirmDeleteAlert } from "@/components/ui/confirm-delete-alert";
import { UserProfileCell, UserStatusCell, UserJoinedCell, UserActionsCell } from "./fragments/TableCells";

const UserCard = ({ user, onEdit, onDelete }) => (
    <div className="flex flex-col p-4 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-zinc-700 transition-all">
        <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
                <UserProfileCell user={user} />
            </div>
            <div className="shrink-0">
                <UserActionsCell user={user} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
        <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
            <UserStatusCell user={user} />
            <div className="ml-auto text-right [&>div]:items-end">
                <UserJoinedCell user={user} />
            </div>
        </div>
    </div>
);

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
            <div className="hidden md:block">
                <DataTable 
                    columns={columns}
                    data={userList}
                    isLoading={isLoading}
                    error={error}
                    emptyState={emptyState}
                />
            </div>
            
            <div className="md:hidden flex flex-col gap-3 p-1 pb-10">
                {userList?.length > 0 ? (
                    userList.map(user => (
                        <UserCard 
                            key={user._id} 
                            user={user} 
                            onEdit={onEdit} 
                            onDelete={setUserToDelete} 
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
