import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { saveUserToFirestore } from '../utils/auth';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed, current user:', user); // Log auth state changes
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    const signIn = async (email, password) => {
        try {
            console.log('Attempting to sign in with:', email); // Log the attempt to sign in
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('Sign in successful, user:', result.user); // Log successful sign-in response
            await saveUserToFirestore(result.user);
        }
        catch (error) {
            console.error('Error during sign-in:', error.message); // Log the error
        }
    };
    const signUp = async (email, password) => {
        try {
            console.log('Attempting to sign up with:', email); // Log the attempt to sign up
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Sign up successful, user:', result.user); // Log successful sign-up response
            await saveUserToFirestore(result.user);
            return result.user;
        }
        catch (error) {
            console.error('Error during sign-up:', error.message); // Log the error
            throw error;
        }
    };
    const logout = async () => {
        try {
            console.log('Logging out user');
            await signOut(auth);
            console.log('User logged out successfully');
        }
        catch (error) {
            console.error('Error during logout:', error.message);
        }
    };
    const googleSignIn = async () => {
        try {
            console.log('Attempting Google sign-in');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google sign-in successful, user:', result.user); // Log Google sign-in response
            await saveUserToFirestore(result.user);
            return result.user;
        }
        catch (error) {
            console.error('Error during Google sign-in:', error.message); // Log detailed error
            if (error.code === 'auth/popup-blocked') {
                throw new Error('Popup was blocked. Please enable popups and try again.');
            }
            throw error;
        }
    };
    const resetPassword = async (email) => {
        try {
            console.log('Sending password reset email to:', email);
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent successfully');
        }
        catch (error) {
            console.error('Error during password reset:', error.message);
        }
    };
    const value = {
        currentUser,
        signIn,
        signUp,
        logout,
        googleSignIn,
        resetPassword,
        loading,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: !loading && children }));
};
