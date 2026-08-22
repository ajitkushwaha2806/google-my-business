import CategoryView from "../category-view";
import { BULK_EDIT_MODES } from "../../bulk-editor/helper/constant";

export const renderViewContent = (props) => {
    const {
        activeView,
        activeBulkMode,
        setActiveBulkMode,
        activeCategory,
        setActiveCategory,
        activeSubCategory,
        setActiveSubCategory
    } = props;

    switch (activeView) {
        case "MENU":
            return (
                <div className="space-y-2 p-3 pb-8">
                    <CategoryView 
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        activeSubCategory={activeSubCategory}
                        setActiveSubCategory={setActiveSubCategory}
                    />
                </div>
            );
        case "BULK":
            return (
                <div className="space-y-1 p-3 pb-8">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                        Edit Modes
                    </div>
                    {BULK_EDIT_MODES.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveBulkMode(mode.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                                activeBulkMode === mode.id 
                                    ? "bg-primary/10 text-primary" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <mode.icon className={`w-4 h-4 ${mode.iconColor || ""}`} /> 
                            {mode.label}
                        </button>
                    ))}
                </div>
            );
        default:
            return null;
    }
};