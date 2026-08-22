import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectItemsTree } from "./fragments/SelectItemsTree";
import { SegmentedControl } from "./fragments/SegmentedControl";
import { APPLY_TO_OPTIONS, ACTION_OPTIONS, TYPE_OPTIONS, ROUNDING_OPTIONS } from "./constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";

export function BulkPriceUpdateSheet({ open, onOpenChange, items = [], categories = [], onApply }) {
  const [applyTo, setApplyTo] = useState("entire_menu");
  const [action, setAction] = useState("increase");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [roundingOption, setRoundingOption] = useState("round_to_9");

  const [selectedCats, setSelectedCats] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const handleSubmit = () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) return;

    if (onApply) {
      onApply({
        applyTo,
        selectedCats,
        selectedItems,
        action,
        type,
        value,
        roundingOption,
        items
      });
    }

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[440px] p-0 flex flex-col gap-0 bg-[#f8fafc] border-l border-border" showCloseButton={true}>
        <SheetHeader className="p-6 pb-5 text-left border-b border-border bg-white">
          <SheetTitle className="text-[20px] font-bold text-foreground">Bulk Price Update</SheetTitle>
          <SheetDescription className="text-[14px] text-muted-foreground mt-1.5 leading-relaxed">
            Apply a flat or percentage increase/decrease to all items and variants in this menu.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Apply To</label>
            <SegmentedControl
              options={APPLY_TO_OPTIONS}
              value={applyTo}
              onChange={setApplyTo}
            />
          </div>

          {applyTo === "selected_items" && (
            <SelectItemsTree 
              items={items} 
              categories={categories}
              selectedCats={selectedCats}
              setSelectedCats={setSelectedCats}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-700">Action</label>
              <SegmentedControl
                options={ACTION_OPTIONS}
                value={action}
                onChange={setAction}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-700">Type</label>
              <SegmentedControl
                options={TYPE_OPTIONS}
                value={type}
                onChange={setType}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Value</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="e.g. 10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-4 pr-10 py-2 w-full text-[14px] h-10 border-input rounded-lg shadow-sm bg-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-medium text-base">
                {type === "percentage" ? "%" : "₹"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ROUNDING OPTION</label>
            <Select value={roundingOption} onValueChange={setRoundingOption}>
              <SelectTrigger className="w-full border-input rounded-lg h-10 text-[14px] px-4 shadow-sm bg-white">
                <SelectValue placeholder="Select rounding option" />
              </SelectTrigger>
              <SelectContent>
                {ROUNDING_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="p-5 border-t border-border flex flex-row gap-3 bg-[#f8fafc]">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1 font-semibold h-11 text-[15px] rounded-lg shadow-sm bg-white hover:bg-slate-50" size="lg">
              Cancel
            </Button>
          </SheetClose>
          <Button 
            onClick={handleSubmit}
            className="flex-1 gap-2 font-bold h-11 bg-primary hover:bg-primary/90 text-white text-[15px] rounded-lg shadow-md transition-all" 
            size="lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
