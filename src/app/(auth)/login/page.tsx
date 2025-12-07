'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail } from '@/lib/validation';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const { error } = await signIn(formData.email, formData.password);

        setLoading(false);

        if (error) {
            setErrors({ submit: error.message });
        } else {
            router.push('/explore');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="glass-card rounded-2xl p-8 md:p-10 border border-white/20 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 hover-glow">
                            <LogIn className="text-white" size={32} />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text-blue mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-indigo-200/80">
                            Sign in to continue to PowerMyPoint
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <Mail className="inline mr-2" size={16} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 transition-all"
                            />
                            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <Lock className="inline mr-2" size={16} />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-white text-sm">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-indigo-300 hover:text-white text-sm transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="glass-dark border border-red-500/30 rounded-xl px-4 py-3">
                                <p className="text-red-300 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl hover-lift hover-glow flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size={20} />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-indigo-200/80">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-indigo-300 hover:text-white font-semibold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
