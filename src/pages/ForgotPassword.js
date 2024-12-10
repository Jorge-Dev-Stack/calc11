import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});
export default function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await resetPassword(data.email);
            toast.success('Password reset email sent!');
        }
        catch (error) {
            toast.error('Failed to send password reset email.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(AuthLayout, { title: "Reset Password", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Enter your email address and we'll send you a link to reset your password." }), _jsx(Input, { label: "Email", type: "email", ...register('email'), error: errors.email?.message }), _jsx(Button, { type: "submit", isLoading: isLoading, className: "w-full", children: "Send Reset Link" }), _jsxs("p", { className: "text-center text-sm text-gray-600", children: ["Remember your password?", ' ', _jsx(Link, { to: "/signin", className: "text-blue-600 hover:text-blue-800", children: "Sign in" })] })] }) }));
}
