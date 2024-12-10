import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function AuthLayout({ children, title }) {
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: title }) }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsx("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: children }) })] }));
}
