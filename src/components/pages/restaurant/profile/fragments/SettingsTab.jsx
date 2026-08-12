import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Coins, Activity, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsTab = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">System Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your business identification and system status.</p>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="gstNumber" className="font-semibold text-gray-700 dark:text-gray-200">GST Number</Label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 z-10" />
            <Input id="gstNumber" placeholder="22AAAAA0000A1Z5" className="pl-10 h-11 uppercase" />
          </div>
          <p className="text-xs text-muted-foreground">Must be a valid 15-character GSTIN.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="currency" className="font-semibold text-gray-700 dark:text-gray-200">Currency</Label>
            <div className="relative">
              <Coins className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select defaultValue="INR">
                <SelectTrigger id="currency" className="pl-10 h-11">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Currently only INR is supported.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="font-semibold text-gray-700 dark:text-gray-200">Account Status</Label>
            <div className="relative">
              <Activity className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select defaultValue="active">
                <SelectTrigger id="status" className="pl-10 h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-border/40 flex justify-end">
        <Button className="h-11 px-8 rounded-md font-medium shadow-sm transition-all hover:shadow-md">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
