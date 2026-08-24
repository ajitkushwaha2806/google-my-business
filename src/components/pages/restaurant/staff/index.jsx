"use client";
import { useState } from "react";
import { TabContent } from "./framents/helpers";
import { TABS } from "./framents/helpers/constant"
import StaffFormSheet from "./framents/staff-form";
import { CustomTabs } from "@/components/ui/custom-tabs"

const StaffManagement = () => {
    const [activeTab, setActiveTab] = useState("manage_users");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    
    const handleAddStaff = () => {
        setEditingStaff(null);
        setIsSheetOpen(true);
    };
    
    const handleEditStaff = (staff) => {
        setEditingStaff(staff);
        setIsSheetOpen(true);
    };
    
    return (
        <div className="flex flex-col h-[calc(100vh-60px)] w-full bg-[#f8fafc] dark:bg-zinc-950 overflow-y-auto">
            <div className="mx-auto w-full p-2 md:p-4 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <CustomTabs
                        tabs={TABS}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <div className="p-6">
                        <TabContent activeTab={activeTab} handleAddStaff={handleAddStaff} handleEditStaff={handleEditStaff} />
                    </div>
                </div>
                </div>
                    <StaffFormSheet
                        isOpen={isSheetOpen}
                        onClose={() => setIsSheetOpen(false)}
                        staff={editingStaff}
                    />
                </div>
    )
}

export default StaffManagement