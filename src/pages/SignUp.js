import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ImageUpload from '../components/ui/ImageUpload';
const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export default function SignUp() {
    const { signUp, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(signUpSchema),
    });
    const handleImageChange = (file) => {
        setProfileImage(file);
    };
    const uploadProfileImage = async (userId, file) => {
        const storageRef = ref(firebase.storage, `profile-images/${userId}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const user = await signUp(data.email, data.password);
            let photoURL = '';
            if (profileImage) {
                photoURL = await uploadProfileImage(user.uid, profileImage);
            }
            await setDoc(doc(db, 'users', user.uid), {
                name: data.name,
                email: data.email,
                photoURL,
                createdAt: new Date().toISOString(),
            });
            toast.success('Account created successfully! Please sign in.');
            navigate('/signin');
        }
        catch (error) {
            toast.error('Failed to create account.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            toast.loading('Attempting Google Sign-In...', { duration: 3000 });
            const result = await googleSignIn();
            if (!result) {
                throw new Error('Popup was blocked or an unexpected error occurred');
            }
            // Ensure user data is added to the database
            await setDoc(doc(db, 'users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                createdAt: new Date().toISOString(),
            }, { merge: true });
            toast.success('Signed up successfully with Google!');
            navigate('/');
        }
        catch (error) {
            console.error('Error during Google sign-in:', error);
            if (error.code === 'auth/popup-blocked') {
                toast.error('Popup blocked. Please ensure that popups are enabled in your browser settings.');
            }
            else {
                toast.error('Failed to sign in with Google. Please try again.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(AuthLayout, { title: "Create an Account", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(ImageUpload, { onChange: handleImageChange, defaultImage: "/default-avatar.png" }), _jsx(Input, { label: "Name", ...register('name'), error: errors.name?.message }), _jsx(Input, { label: "Email", type: "email", ...register('email'), error: errors.email?.message }), _jsx(Input, { label: "Password", type: "password", ...register('password'), error: errors.password?.message }), _jsx(Input, { label: "Confirm Password", type: "password", ...register('confirmPassword'), error: errors.confirmPassword?.message }), _jsx(Button, { type: "submit", isLoading: isLoading, className: "w-full", children: "Sign Up" }), _jsxs("div", { className: "relative my-4", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or continue with" }) })] }), _jsxs(Button, { type: "button", variant: "outline", onClick: handleGoogleSignUp, isLoading: isLoading, className: "w-full", children: [_jsx("img", { src: "/google.svg", alt: "Google", className: "w-5 h-5 mr-2" }), "Sign up with Google"] }), _jsxs("p", { className: "text-center text-sm text-gray-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/signin", className: "text-blue-600 hover:text-blue-800", children: "Sign in" })] })] }) }));
}
