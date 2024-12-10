import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { twMerge } from 'tailwind-merge';
export default function Button({ children, className, isLoading, variant = 'primary', ...props }) {
    const baseStyles = 'flex justify-center items-center px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    };
    return (_jsxs("button", { className: twMerge(baseStyles, variants[variant], className), disabled: isLoading, ...props, children: [isLoading ? (_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : null, children] }));
}
