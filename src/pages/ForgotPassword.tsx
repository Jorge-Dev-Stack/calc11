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

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await resetPassword(data.email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/signin" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}