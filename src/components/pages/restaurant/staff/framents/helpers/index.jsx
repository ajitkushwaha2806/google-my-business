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
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Track user staff&apos;s activity , permissions and roles.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleAddStaff}
                                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all active:scale-95 text-sm"
                                >
                                    <Plus size={16} strokeWidth={2.5} />
                                    Add Staff
                                </button>
                            </div>
                        </div>
                    
                        <div className="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white">
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