"use client";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { useItem } from "@/store/hooks/useItem";
import React, { useState, useMemo } from "react";
import { getCategoryName } from "../helper/utils";
import { BulkTable } from "../components/BulkTable";
import { MenuService } from "@/services/frontend/menu";
import { useQueryClient } from "@tanstack/react-query";
import { useCategory } from "@/store/hooks/useCategory";
import { useRestaurant } from "@/store/hooks/useRestaurant";
import useNotification from "@/store/hooks/useNotification";
import { Loader2, Undo2, AlertCircle, Save } from "lucide-react";

export function DescriptionEditor() {
  const { restaurantId } = useRestaurant();
  const { items, isLoading: itemsLoading } = useItem(restaurantId, {});
  const { rawCategories, isLoading: catsLoading } = useCategory(restaurantId);
  const notification = useNotification();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const initialValues = useMemo(() => {
    const values = {};
    if (items) {
      items.forEach(item => {
        values[item.id] = item.description || "";
      });
    }
    return values;
  }, [items]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = [];
      Object.keys(values).forEach(id => {
        if (values[id] !== initialValues[id]) {
          payload.push({ id, description: values[id] });
        }
      });

      if (payload.length === 0) {
        notification.error("No changes to save.");
        return;
      }

      setIsSaving(true);
      try {
        await MenuService.bulkUpdateDescription(restaurantId, { items: payload });
        notification.success("Menu descriptions updated successfully!");
        formik.resetForm({ values });
        queryClient.invalidateQueries({ queryKey: ["items", restaurantId] });
      } catch (err) {
        console.error("Description save error:", err);
        notification.error(err?.response?.data?.message || "Failed to update descriptions.");
      } finally {
        setIsSaving(false);
      }
    }
  });

  const handleDescriptionChange = (itemId, val) => {
    formik.setFieldValue(itemId, val);
  };

  const handleUndoItem = (itemId) => {
    formik.setFieldValue(itemId, formik.initialValues[itemId]);
  };

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items;
  }, [items, formik.values]);

  const unsavedCount = useMemo(() => {
    return Object.keys(formik.values).filter(id => formik.values[id] !== formik.initialValues[id]).length;
  }, [formik.values, formik.initialValues]);

  if (itemsLoading || catsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white h-full font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const columns = [
    {
      header: "Item Name",
      width: "30%",
      render: (item) => {
        const catName = item.category ? getCategoryName(item.category, rawCategories) : "";
        const subCatName = item.subCategory ? getCategoryName(item.subCategory, rawCategories) : "";
        const breadcrumb = catName && subCatName ? `${catName} > ${subCatName}` : catName || subCatName || "Uncategorized";

        return (
          <div className="flex flex-col pt-1">
            <span className="font-semibold font-sans text-[14px] text-gray-800 tracking-tight leading-tight">{item.name}</span>
            <span className="text-[11px] font-medium font-sans text-gray-400 mt-0.5 uppercase tracking-wide">{breadcrumb}</span>
          </div>
        );
      }
    },
    {
      header: "Description",
      className: "pl-4",
      render: (item) => {
        const isEdited = formik.values[item.id] !== formik.initialValues[item.id];
        const currentDesc = formik.values[item.id] || "";

        return (
          <div className="flex items-center gap-3 pt-1 pb-1 w-full max-w-2xl pr-4">
            <textarea
              value={currentDesc}
              onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
              placeholder="Add a delicious description..."
              rows={2}
              className={`w-full text-[14px] font-medium text-slate-700 bg-white border rounded-md p-3 outline-none resize-none shadow-none transition-all duration-200 ${
                isEdited 
                  ? "border-amber-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-400" 
                  : "border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              }`}
            />
            {isEdited && (
              <button
                onClick={() => handleUndoItem(item.id)}
                className="text-amber-500 hover:text-amber-600 p-2 rounded-md hover:bg-amber-50 transition-colors shrink-0 cursor-pointer"
                title="Revert changes"
              >
                <Undo2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  if (!items || items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-450 font-medium font-sans">
        No menu items found.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col relative h-full font-sans">
      
      <div className="sticky top-0 z-10 bg-white flex flex-col">
        <div className="flex items-center justify-end px-8 py-4 border-b border-gray-200 bg-white">
          <Button 
            onClick={formik.handleSubmit} 
            disabled={isSaving || unsavedCount === 0}
            className="h-10 px-6 rounded-md bg-primary hover:bg-primary/90 text-white font-semibold font-sans shadow-none flex items-center gap-2 transition-all"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <BulkTable 
          columns={columns} 
          data={filteredItems} 
          rowKey="id" 
          emptyMessage="No items match your filters." 
        />
      </div>

    </div>
  );
}
