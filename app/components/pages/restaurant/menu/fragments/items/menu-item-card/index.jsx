import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import ItemDetails from "./fragments/ItemDetails";
import ItemVariants from "./fragments/ItemVariants";
import useNotification from "@/store/hooks/useNotification";

export default function MenuItemRow({
    item: initialItem,
    onChange,
    onDelete,
}) {
    const [item, setItem] = useState(initialItem);
    const notification = useNotification();

    useEffect(() => {
        setItem(initialItem);
    }, [initialItem]);

    const isEdited = JSON.stringify(item) !== JSON.stringify(initialItem);

    const [isHovered, setIsHovered] = useState(false);

    const updateField = (field, value) => {
        setItem((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const variants = item?.variants || [];

    const addVariantGroup = () => {
        if (variants && variants.length >= 1) {
            notification.error("Only a single variant property is allowed.", { duration: 5000 });
            return;
        }
        const newGroup = {
            property_name: "New Group",
            property_id: `temp-${crypto.randomUUID()}`,
            options: []
        };
        updateField("variants", [...variants, newGroup]);
    };

    const updateVariantGroup = (groupIndex, field, value) => {
        const newVariants = [...variants];
        newVariants[groupIndex] = { ...newVariants[groupIndex], [field]: value };
        updateField("variants", newVariants);
    };

    const deleteVariantGroup = (groupIndex) => {
        const newVariants = variants.filter((_, idx) => idx !== groupIndex);
        updateField("variants", newVariants);
    };

    const addVariantOption = (groupIndex) => {
        const newVariants = [...variants];
        const group = { ...newVariants[groupIndex] };
        group.options = [
            ...(group.options || []),
            { name: "New Option", price: 0, is_default: false, option_id: `temp-${crypto.randomUUID()}` }
        ];
        newVariants[groupIndex] = group;
        updateField("variants", newVariants);
    };

    const updateVariantOption = (groupIndex, optionIndex, field, value) => {
        const newVariants = [...variants];
        const group = { ...newVariants[groupIndex] };
        const newOptions = [...(group.options || [])];
        newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };

        group.options = newOptions;
        newVariants[groupIndex] = group;
        updateField("variants", newVariants);
    };

    const deleteVariantOption = (groupIndex, optionIndex) => {
        const newVariants = [...variants];
        const group = { ...newVariants[groupIndex] };
        group.options = (group.options || []).filter((_, idx) => idx !== optionIndex);
        newVariants[groupIndex] = group;
        updateField("variants", newVariants);
    };

    const addSuggestedVariant = (suggestion) => {
        if (variants && variants.length >= 1) {
            notification.error("Only a single variant property is allowed.", { duration: 5000 });
            return;
        }
        const newGroup = {
            property_name: suggestion.property_name,
            property_id: `temp-${crypto.randomUUID()}`,
            options: suggestion.options.map(opt => ({
                name: opt,
                price: 0,
                is_default: false,
                option_id: `temp-${crypto.randomUUID()}`
            }))
        };
        updateField("variants", [...variants, newGroup]);
    };

    return (
        <div
            className={`group border rounded-xl p-3 transition-all relative ${
                item?.status === 'delete' ? "bg-red-50 border-red-300 pointer-events-none opacity-60" :
                item?.id?.toString().startsWith("temp-") 
                    ? "bg-green-50/50 border-green-300 hover:border-green-500"
                    : "bg-white hover:border-orange-300"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isEdited && (
                <button
                    onClick={() => onChange?.(item)}
                    className="absolute -top-3 -right-3 bg-primary text-primary-foreground h-8 px-4 rounded-full shadow-lg z-10 text-[11px] font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                >
                    <CheckCircle2 size={14} strokeWidth={3} /> SAVE
                </button>
            )}
            
            <ItemDetails 
                item={item}
                updateField={updateField}
                onDelete={onDelete}
            />

            <ItemVariants 
                variants={variants}
                addVariantGroup={addVariantGroup}
                updateVariantGroup={updateVariantGroup}
                deleteVariantGroup={deleteVariantGroup}
                addVariantOption={addVariantOption}
                updateVariantOption={updateVariantOption}
                deleteVariantOption={deleteVariantOption}
                addSuggestedVariant={addSuggestedVariant}
            />
        </div>
    );
}
