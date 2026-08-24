import { TABS } from "./constant";
import StaffTable from "../staff-table";
import { Plus, Users } from "lucide-react";
import Loader from "@/components/global/loader";
import { useStaff } from "@/store/hooks/useStaff";
import { useRestaurant } from "@/store/hooks/useRestaurant";

export const TabContent = ({ activeTab, handleAddStaff, handleEditStaff }) => {
    const { restaurantId } = useRestaurant();
    const { staffList, isLoading, error } = useStaff(restaurantId);

    if (isLoading || !restaurantId) {
        return (
            <div className="flex items-center justify-center min-h-[300px] w-full">
                <Loader />
            </div>
        );
    }

    switch (activeTab) {

            case "manage_users":
                return (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800 md:border-none md:pb-0">
                            <div className="hidden md:block">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Track user staff&apos;s activity, permissions and roles.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button
                                    onClick={handleAddStaff}
                                    className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 md:py-2 rounded-md font-semibold shadow-sm transition-all active:scale-95 text-sm w-full md:w-auto"
                                >
                                    <Plus size={18} strokeWidth={2.5} className="md:w-4 md:h-4" />
                                    Add Staff
                                </button>
                            </div>
                        </div>
                    
                        <div className="md:border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-transparent md:bg-white md:dark:bg-zinc-900 -mt-2 md:mt-0">
                            <StaffTable
                                staffList={staffList} 
                                isLoading={isLoading} 
                                error={error} 
                                onEdit={handleEditStaff} 
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                        <Users size={48} className="text-gray-200 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Work in Progress</h3>
                        <p className="text-sm mt-1 max-w-sm mx-auto">This tab ({TABS.find(t => t.id === activeTab)?.label}) is currently under construction.</p>
                    </div>
                );
        }
    };