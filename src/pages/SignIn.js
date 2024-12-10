import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export default function SignIn() {
    const { signIn, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(signInSchema),
    });
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            await signIn(data.email, data.password);
            toast.success('Successfully signed in!');
            navigate('/');
        }
        catch (error) {
            console.error('Sign-in error:', error);
            toast.error(error.message || 'Failed to sign in');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            const user = await googleSignIn();
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    lastSignIn: new Date().toISOString(),
                }, { merge: true });
                toast.success('Successfully signed in with Google!');
                navigate('/');
            }
        }
        catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code === 'auth/popup-blocked') {
                toast.error('Please enable popups and try again');
            }
            else if (error.code === 'auth/cancelled-popup-request') {
                // User cancelled the popup, no need to show error
            }
            else {
                toast.error('Failed to sign in with Google. Please try again.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(AuthLayout, { title: "Sign In", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(Input, { label: "Email", type: "email", ...register('email'), error: errors.email?.message }), _jsx(Input, { label: "Password", type: "password", ...register('password'), error: errors.password?.message }), _jsx("div", { className: "flex justify-between items-center", children: _jsx(Link, { to: "/forgot-password", className: "text-sm text-blue-600 hover:text-blue-800", children: "Forgot Password?" }) }), _jsx(Button, { type: "submit", isLoading: isLoading, className: "w-full", children: "Sign In" }), _jsxs("div", { className: "relative my-4", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })] }), _jsxs(Button, { type: "button", variant: "outline", onClick: handleGoogleSignIn, isLoading: isLoading, className: "w-full", children: [_jsx("img", { src: "/google.svg", alt: "Google", className: "w-5 h-5 mr-2" }), "Sign in with Google"] }), _jsxs("p", { className: "text-center text-sm text-gray-600", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", className: "text-blue-600 hover:text-blue-800", children: "Sign up" })] })] }) }));
}
