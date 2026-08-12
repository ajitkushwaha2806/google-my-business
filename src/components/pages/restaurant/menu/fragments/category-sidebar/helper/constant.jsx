import { AlignLeft, Cloud, DollarSign, FileUp, ImageIcon, Layers, PlusCircle, Share, Table } from "lucide-react";

export const BULK_EDIT_MODES = [
        { id: "PRICE", icon: DollarSign, label: "Price Editor" },
        { id: "STRUCTURE", icon: Layers, label: "Structure Organizer" },
        { id: "ADDONS", icon: PlusCircle, label: "Addons Builder" },
        { id: "DESCRIPTION", icon: AlignLeft, label: "Description Editor" },
        { id: "IMAGE", icon: ImageIcon, label: "Image Editor" },
        { id: "UPLOAD", icon: FileUp, label: "Upload Menu" },
        { id: "TRANSFER", icon: Share, label: "Transfer Menu" },
        { id: "EXPORT_IMAGES", icon: Cloud, label: "Export Images" },
        { id: "EXPORT_CSV", icon: Table, label: "Export CSV" },
    ];
