'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, User, Mail, Lock, Briefcase, Heart, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        accountType: 'personal',
        interests: [] as string[],
        newsletter: false,
        terms: false,
        plan: 'free',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const interestOptions = [
        { name: 'Business', icon: '💼', color: 'from-indigo-600 to-purple-700' },
        { name: 'Education', icon: '📚', color: 'from-slate-600 to-slate-700' },
        { name: 'Technology', icon: '⚡', color: 'from-purple-600 to-purple-700' },
        { name: 'Marketing', icon: '📈', color: 'from-indigo-700 to-purple-800' },
        { name: 'Design', icon: '🎨', color: 'from-slate-700 to-slate-800' },
        { name: 'Science', icon: '🔬', color: 'from-purple-700 to-purple-800' },
    ];

    const validatePassword = (password: string) => {
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };

    const getPasswordStrengthColor = (strength: string) => {
        if (strength === 'weak') return 'bg-red-500';
        if (strength === 'medium') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === 'interests') {
                const interest = value;
                setFormData(prev => ({
                    ...prev,
                    interests: checked
                        ? [...prev.interests, interest]
                        : prev.interests.filter(i => i !== interest)
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else if (type === 'radio') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        setErrors(prev => ({ ...prev, [name]: '' }));

        if (name === 'password') {
            setPasswordStrength(validatePassword(value) as any);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.terms) newErrors.terms = 'You must accept the terms';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        // Payment Simulation
        if (formData.plan === 'pro') {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Mock payment
        }

        try {
            const { error } = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                role: formData.role,
                account_type: formData.accountType,
                interests: formData.interests,
                newsletter: formData.newsletter,
                tier_plan: formData.plan,
            });

            if (error) {
                setErrors({ submit: error.message });
            } else {
                router.push('/explore');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ submit: 'Failed to create account' });
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
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                    }}
                />
            ))}

            <div className="w-full relative z-10 ">
                <div className="grid md:grid-cols-2 gap-8 items-start ">
                    {/* Left Side - Hero Content */}
                    <div className="hidden md:block space-y-8 p-8 ">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
                                <Zap className="text-purple-400" size={16} />
                                <span className="text-sm font-semibold text-white">Enterprise Grade</span>
                            </div>

                            <h1 className="text-6xl font-black text-white leading-tight">
                                Professional
                                <span className="block gradient-text text-transparent bg-clip-text">
                                    Presentations
                                </span>
                                Made Simple
                            </h1>

                            <p className="text-xl text-slate-300 leading-relaxed">
                                Trusted by Fortune 500 companies and leading professionals worldwide
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: '🔒', text: 'Enterprise security', color: 'from-indigo-600 to-purple-700' },
                                { icon: '📊', text: 'Advanced analytics', color: 'from-slate-600 to-slate-700' },
                                { icon: '⚡', text: 'Real-time collaboration', color: 'from-purple-600 to-purple-700' },
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
                    </div>

                    {/* Right Side - Form */}
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-slate-600/30 rounded-3xl blur-2xl opacity-20"></div>

                        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <Sparkles className="text-white relative z-10" size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
                                <p className="text-slate-400">Join the professional community</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
                                        <User size={16} />
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('fullName')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        {focusedField === 'fullName' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
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
                                            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        {focusedField === 'email' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
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
                                            placeholder="Create a strong password"
                                            className="w-full px-4 py-3 pr-12 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {focusedField === 'password' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex gap-1 h-1.5">
                                                <div className={`flex-1 rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordStrength)}`} style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }} />
                                            </div>
                                            <p className="text-xs text-slate-400 font-semibold capitalize">{passwordStrength} password strength</p>
                                        </div>
                                    )}
                                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
                                        <Lock size={16} />
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Confirm your password"
                                            className="w-full px-4 py-3 pr-12 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {focusedField === 'confirmPassword' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>

                                {/* Role */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-purple-400">
                                        <Briefcase size={16} />
                                        Your Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-purple-500 focus:bg-white/10 text-white transition-all duration-300 outline-none cursor-pointer"
                                    >
                                        <option value="" className="bg-slate-900">Select your role</option>
                                        <option value="student" className="bg-slate-900">🎓 Student</option>
                                        <option value="teacher" className="bg-slate-900">👨‍🏫 Teacher</option>
                                        <option value="professional" className="bg-slate-900">💼 Professional</option>
                                        <option value="business" className="bg-slate-900">🏢 Business Owner</option>
                                    </select>
                                </div>

                                {/* Account Type */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                        Account Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['personal', 'business'].map((type) => (
                                            <label
                                                key={type}
                                                className={`relative flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.accountType === type
                                                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30'
                                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="accountType"
                                                    value={type}
                                                    checked={formData.accountType === type}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className="text-2xl">{type === 'personal' ? '👤' : '🏢'}</span>
                                                <span className="text-white font-semibold capitalize">{type}</span>
                                                {formData.accountType === type && (
                                                    <CheckCircle2 className="absolute top-2 right-2 text-purple-400" size={20} />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Plan Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                        Select Plan
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label
                                            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.plan === 'free'
                                                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/30'
                                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="plan"
                                                value="free"
                                                checked={formData.plan === 'free'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="text-2xl mb-1">🌱</span>
                                            <span className="text-white font-bold">Free</span>
                                            <span className="text-xs text-slate-400">$0/mo</span>
                                            {formData.plan === 'free' && (
                                                <CheckCircle2 className="absolute top-2 right-2 text-emerald-400" size={20} />
                                            )}
                                        </label>

                                        <label
                                            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${formData.plan === 'pro'
                                                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30'
                                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="plan"
                                                value="pro"
                                                checked={formData.plan === 'pro'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="text-2xl mb-1">🚀</span>
                                            <span className="text-white font-bold">Pro</span>
                                            <span className="text-xs text-slate-400">$19/mo</span>
                                            {formData.plan === 'pro' && (
                                                <CheckCircle2 className="absolute top-2 right-2 text-purple-400" size={20} />
                                            )}
                                        </label>
                                    </div>
                                    {formData.plan === 'pro' && (
                                        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                            <p className="text-sm text-purple-200 flex items-center gap-2">
                                                <Lock size={14} />
                                                Payment will be processed instantly.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Interests */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                        <Heart size={16} />
                                        Your Interests
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {interestOptions.map((interest) => (
                                            <label
                                                key={interest.name}
                                                className={`relative flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${formData.interests.includes(interest.name)
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="interests"
                                                    value={interest.name}
                                                    checked={formData.interests.includes(interest.name)}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <span className="text-xl">{interest.icon}</span>
                                                <span className="text-white text-sm font-semibold">{interest.name}</span>
                                                {formData.interests.includes(interest.name) && (
                                                    <CheckCircle2 className="absolute top-2 right-2 text-purple-400" size={16} />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex-shrink-0 mt-0.5">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={formData.terms}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-5 h-5 border-2 border-white/20 rounded bg-white/5 peer-checked:border-purple-500 peer-checked:bg-purple-500 transition-all duration-300 flex items-center justify-center">
                                            {formData.terms && <CheckCircle2 className="text-white" size={14} />}
                                        </div>
                                    </div>
                                    <span className="text-sm text-slate-300 leading-relaxed">
                                        I agree to the <span className="text-purple-400 font-semibold">Terms</span> and <span className="text-purple-400 font-semibold">Privacy Policy</span>
                                    </span>
                                </label>
                                {errors.terms && <p className="text-red-400 text-sm mt-1">{errors.terms}</p>}

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                        <p className="text-red-400 text-sm">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                    <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center gap-3 font-bold text-white text-lg shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-purple-500/50">
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                                <span>Create Account</span>
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center">
                                <p className="text-slate-400">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors underline decoration-purple-400/50 hover:decoration-purple-300">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}