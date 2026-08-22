import { AlignLeft, DollarSign, FileUp, ImageIcon, Layers, PlusCircle, Table } from "lucide-react";

export const BULK_EDIT_MODES = [
        { id: "PRICE", icon: DollarSign, label: "Price Editor" },
        { id: "STRUCTURE", icon: Layers, label: "Structure Organizer" },
        { id: "ADDONS", icon: PlusCircle, label: "Addons Builder" },
        { id: "DESCRIPTION", icon: AlignLeft, label: "Description Editor" },
        { id: "IMAGE", icon: ImageIcon, label: "Image Editor" },
        { id: "IMPORT", icon: FileUp, label: "Import Menu" },
        { id: "EXPORT_CSV", icon: Table, label: "Export CSV" },
    ];
