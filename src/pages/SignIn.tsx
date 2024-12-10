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

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { signIn, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await googleSignIn();
      
      if (user) {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSignIn: new Date().toISOString(),
          },
          { merge: true }
        );

        toast.success('Successfully signed in with Google!');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error('Please enable popups and try again');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled the popup, no need to show error
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        
        <div className="flex justify-between items-center">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign In
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          isLoading={isLoading}
          className="w-full"
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}