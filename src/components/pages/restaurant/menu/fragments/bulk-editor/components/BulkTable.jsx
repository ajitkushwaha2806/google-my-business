import React from 'react';

export function BulkTable({ columns, data, rowKey, emptyMessage = "No items found." }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 font-medium font-sans">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden flex flex-col font-poppins h-full">
            <div className="flex items-center px-3 py-3 border-b border-gray-200 bg-white">
                {columns.map((col, index) => (
                    <div 
                        key={index} 
                        className={`font-medium text-slate-600 text-[14px] ${col.className || ''}`}
                        style={col.width ? { width: col.width } : { flex: 1 }}
                    >
                        {col.header}
                    </div>
                ))}
            </div>
            
            <div className="divide-y divide-gray-200 flex-1 overflow-y-auto">
                {data.map((row, rowIndex) => (
                    <div 
                        key={rowKey ? row[rowKey] : rowIndex} 
                        className="flex items-start px-6 py-5 hover:bg-slate-50 transition-colors duration-150"
                    >
                        {columns.map((col, colIndex) => (
                            <div 
                                key={colIndex} 
                                className={`${col.className || ''}`}
                                style={col.width ? { width: col.width } : { flex: 1 }}
                            >
                                {col.render(row, rowIndex)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
