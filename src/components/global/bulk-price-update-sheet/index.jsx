import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectItemsTree } from "./fragments/SelectItemsTree";
import { SegmentedControl } from "./fragments/SegmentedControl";
import { APPLY_TO_OPTIONS, ACTION_OPTIONS, TYPE_OPTIONS, ROUNDING_OPTIONS } from "./constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";

export function BulkPriceUpdateSheet({ open, onOpenChange, items = [], categories = [] }) {
  const [applyTo, setApplyTo] = useState("entire_menu");
  const [action, setAction] = useState("increase");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [roundingOption, setRoundingOption] = useState("round_to_9");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[440px] p-0 flex flex-col gap-0 bg-background border-l border-border" showCloseButton={true}>
        <SheetHeader className="p-6 pb-5 text-left border-b border-border">
          <SheetTitle className="text-[22px] font-bold text-foreground">Bulk Price Update</SheetTitle>
          <SheetDescription className="text-[15px] text-muted-foreground mt-2 leading-relaxed">
            Apply a flat or percentage increase/decrease to all items and variants in this menu.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-7">
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-bold text-slate-700">Apply To</label>
            <SegmentedControl
              options={APPLY_TO_OPTIONS}
              value={applyTo}
              onChange={setApplyTo}
            />
          </div>

          {applyTo === "selected_items" && (
            <SelectItemsTree items={items} categories={categories} />
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-bold text-slate-700">Action</label>
              <SegmentedControl
                options={ACTION_OPTIONS}
                value={action}
                onChange={setAction}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-bold text-slate-700">Type</label>
              <SegmentedControl
                options={TYPE_OPTIONS}
                value={type}
                onChange={setType}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-bold text-slate-700">Value</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="e.g. 10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-4 pr-10 py-2 w-full text-[15px] h-12 border-input rounded-lg shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-medium text-lg">
                {type === "percentage" ? "%" : "₹"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">ROUNDING OPTION</label>
            <Select value={roundingOption} onValueChange={setRoundingOption}>
              <SelectTrigger className="w-full border-input rounded-lg h-12 text-[15px] px-4 shadow-sm bg-background">
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

        <SheetFooter className="p-6 border-t border-border flex flex-row gap-3">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1 font-semibold h-[50px] text-[16px] rounded-lg shadow-sm" size="lg">
              Cancel
            </Button>
          </SheetClose>
          <Button className="flex-1 gap-2 font-semibold h-[50px] bg-[#898989] hover:bg-[#787878] text-white text-[16px] rounded-lg shadow-sm" size="lg">
            <CheckCircle2 className="w-5 h-5" />
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
