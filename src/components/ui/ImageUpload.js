import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
export default function ImageUpload({ onChange, defaultImage = '/default-avatar.png', className, }) {
    const [preview, setPreview] = useState(defaultImage);
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs("div", { className: twMerge('flex flex-col items-center', className), children: [_jsxs("div", { onClick: handleClick, className: "relative w-24 h-24 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity", children: [_jsx("img", { src: preview, alt: "Profile", className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity", children: _jsx("span", { className: "text-white text-sm", children: "Change" }) })] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" })] }));
}
