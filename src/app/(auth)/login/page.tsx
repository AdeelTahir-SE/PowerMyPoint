'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

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
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrors({ submit: 'Please fill in all fields' });
            return;
        }

        setLoading(true);

        try {
            const { error } = await signIn(formData.email, formData.password);

            if (error) {
                setErrors({ submit: error.message });
            } else {
                router.push('/explore');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ submit: 'Failed to sign in' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                />
            ))}

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Hero Content */}
                    <div className="hidden md:block space-y-8 p-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                                <Shield className="text-blue-400" size={16} />
                                <span className="text-sm font-semibold text-white">Secure Access</span>
                            </div>

                            <h1 className="text-6xl font-black text-white leading-tight">
                                Welcome
                                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-slate-300 text-transparent bg-clip-text">
                                    Back
                                </span>
                            </h1>

                            <p className="text-xl text-slate-300 leading-relaxed">
                                Access your workspace and continue creating professional presentations
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: '🔐', text: 'Bank-level encryption', color: 'from-blue-600 to-blue-700' },
                                { icon: '⚡', text: 'Instant sync across devices', color: 'from-slate-600 to-slate-700' },
                                { icon: '🌐', text: 'Access from anywhere', color: 'from-cyan-600 to-cyan-700' },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <span className="text-white font-semibold">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            {[
                                { value: '50K+', label: 'Active Users' },
                                { value: '99.9%', label: 'Uptime' },
                                { value: '24/7', label: 'Support' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-slate-600/30 rounded-3xl blur-2xl opacity-20"></div>

                        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <LogIn className="text-white relative z-10" size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
                                <p className="text-slate-400">Sign in to your account</p>
                            </div>

                            <div onSubmit={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-blue-400">
                                        <Mail size={16} />
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        {focusedField === 'email' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-blue-400">
                                        <Lock size={16} />
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 pr-12 bg-white/5 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {focusedField === 'password' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-5 h-5 border-2 border-white/20 rounded bg-white/5 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-300 flex items-center justify-center">
                                                {formData.rememberMe && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-white">Remember me</span>
                                    </label>
                                    <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors font-semibold">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-sm">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="relative w-full group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                    <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center gap-3 font-bold text-white text-lg shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-blue-500/50">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Signing In...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn size={20} />
                                                <span>Sign In</span>
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-slate-900/90 text-slate-400">Or continue with</span>
                                    </div>
                                </div>

                                {/* SSO Options */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" className="text-white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" className="text-blue-500" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" className="text-yellow-500" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" className="text-green-500" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="text-white font-semibold text-sm">Google</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                        </svg>
                                        <span className="text-white font-semibold text-sm">GitHub</span>
                                    </button>
                                </div>
                            </div>

                            {/* Signup Link */}
                            <div className="mt-8 text-center">
                                <p className="text-slate-400">
                                    Don&apos;t have an account?{' '}
                                    <button className="cursor-pointer text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-blue-400/50 hover:decoration-blue-300">
                                        Create Account
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}