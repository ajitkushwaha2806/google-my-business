import { useState, useRef } from "react";
import { cn, getImageUrl } from "@/lib/utils";
import { ItemImage } from "@/components/global/item-image";
import { UploadService } from "@/services/frontend/upload";
import useNotification from "@/store/hooks/useNotification";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";

export function ImageUploadCard({ item, categoryPath, updateItem, restaurantId, onCardClick }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const notification = useNotification();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const uploadFile = async (file) => {
        if (!file || !file.type.startsWith("image/")) {
            notification.error("Please upload a valid image file.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("path", "menu/items");
            
            const res = await UploadService.uploadFile(formData, restaurantId);
            const imageId = res?.imageId || res?.data?.imageId;
            
            if (!imageId) throw new Error("Failed to get image ID from upload response");

            await updateItem({ itemId: item._id, data: { image: imageId } });
            
        } catch (error) {
            console.error("Upload error:", error);
            notification.error(error?.response?.data?.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (isUploading) return;
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await uploadFile(files[0]);
        }
    };

    const handleFileInput = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await uploadFile(files[0]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div 
            className="flex flex-col bg-white border border-gray-200/80 rounded-md overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="relative w-full aspect-[4/3] bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
                <ItemImage 
                    src={item.image ? getImageUrl(item.image, true, "card") : null} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
 
                <div className={cn(
                    "absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-all duration-200 z-10",
                    isDragging ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                )}>
                    <Camera className="w-8 h-8 mb-3 animate-bounce" strokeWidth={1.5} />
                    <span className="font-semibold text-[13px] tracking-wide">Drop image to upload</span>
                </div>

                <div 
                    onClick={onCardClick}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-0 cursor-pointer text-white"
                >
                    <div className="bg-white/20 p-2.5 rounded-full mb-2.5 backdrop-blur-md shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                        <Camera className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="font-bold text-[11px] tracking-widest uppercase">Upload</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileInput} 
                    />
                </div>

                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-primary z-20">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-[11px] font-bold tracking-wide uppercase">Uploading...</span>
                    </div>
                )}
            </div>

            <div className="px-3.5 py-2 flex flex-col bg-white">
                <h3 className="text-[13px] font-[500] text-[#0f172a] truncate" title={item.name}>
                    {item.name}
                </h3>
            </div>
        </div>
    );
}
