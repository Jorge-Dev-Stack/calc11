import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (_jsxs("div", { children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsx("input", { ref: ref, className: twMerge('block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm', error ? 'border-red-300' : 'border-gray-300', className), ...props }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error }))] }));
});
Input.displayName = 'Input';
export default Input;
