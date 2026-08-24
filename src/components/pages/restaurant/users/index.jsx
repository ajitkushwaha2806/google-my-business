"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import UserTable from "./fragments/user-table";
import Loader from "@/components/global/loader";
import { useUsers } from "@/store/hooks/useUsers";
import UserFormSheet from "./fragments/user-form-sheet";
import { useRestaurant } from "@/store/hooks/useRestaurant";

const UserManagement = () => {
    const { restaurantId } = useRestaurant();
    const { userList, isLoading, error } = useUsers(restaurantId);
    
    const [editingUser, setEditingUser] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsSheetOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsSheetOpen(true);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-60px)] w-full bg-[#f8fafc] dark:bg-zinc-950 overflow-y-auto">
            <div className="mx-auto w-full p-2 md:p-4 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    
                    <div className="p-4 md:p-6 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                            <div className="hidden md:block">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Track and manage your restaurant&apos;s registered customers.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={handleAddUser}
                                    className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 md:py-2 rounded-md font-semibold shadow-sm transition-all active:scale-95 text-sm w-full md:w-auto"
                                >
                                    <Plus size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                    Add User
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-6">
                        <div className="md:border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-transparent md:bg-white md:dark:bg-zinc-900">
                            {isLoading || !restaurantId ? (
                                <div className="flex items-center justify-center min-h-[300px] w-full">
                                    <Loader />
                                </div>
                            ) : (
                                <UserTable 
                                    userList={userList}
                                    isLoading={isLoading}
                                    error={error}
                                    onEdit={handleEditUser}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <UserFormSheet 
                isOpen={isSheetOpen}
                onClose={() => {
                    setIsSheetOpen(false);
                    setEditingUser(null);
                }}
                user={editingUser}
            />
        </div>
    );
};

export default UserManagement;
