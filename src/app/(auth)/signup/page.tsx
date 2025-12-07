'use client';

import { useState } from 'react';
import { Eye, EyeOff, Sparkles, User, Mail, Lock, Briefcase, Heart, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
export default function SignupPage() {
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
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const interestOptions = [
        { name: 'Business', icon: '💼', color: 'from-blue-600 to-blue-700' },
        { name: 'Education', icon: '📚', color: 'from-slate-600 to-slate-700' },
        { name: 'Technology', icon: '⚡', color: 'from-cyan-600 to-cyan-700' },
        { name: 'Marketing', icon: '📈', color: 'from-blue-700 to-blue-800' },
        { name: 'Design', icon: '🎨', color: 'from-slate-700 to-slate-800' },
        { name: 'Science', icon: '🔬', color: 'from-cyan-700 to-cyan-800' },
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
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Account created successfully! 🎉');
        }, 2000);
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
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                                <Zap className="text-blue-400" size={16} />
                                <span className="text-sm font-semibold text-white">Enterprise Grade</span>
                            </div>

                            <h1 className="text-6xl font-black text-white leading-tight">
                                Professional
                                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-slate-300 text-transparent bg-clip-text">
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
                                { icon: '🔒', text: 'Enterprise security', color: 'from-blue-600 to-blue-700' },
                                { icon: '📊', text: 'Advanced analytics', color: 'from-slate-600 to-slate-700' },
                                { icon: '⚡', text: 'Real-time collaboration', color: 'from-cyan-600 to-cyan-700' },
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
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-slate-600/30 rounded-3xl blur-2xl opacity-20"></div>

                        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <Sparkles className="text-white relative z-10" size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
                                <p className="text-slate-400">Join the professional community</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-blue-400">
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
                                            className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/10 text-white placeholder-slate-400 transition-all duration-300 outline-none"
                                        />
                                        {focusedField === 'fullName' && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 -z-10 blur-xl"></div>
                                        )}
                                    </div>
                                </div>

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
                                            placeholder="Create a strong password"
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
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex gap-1 h-1.5">
                                                <div className={`flex-1 rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordStrength)}`} style={{ width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%' }} />
                                            </div>
                                            <p className="text-xs text-slate-400 font-semibold capitalize">{passwordStrength} password strength</p>
                                        </div>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-2 transition-all group-focus-within:text-blue-400">
                                        <Briefcase size={16} />
                                        Your Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-blue-500 focus:bg-white/10 text-white transition-all duration-300 outline-none cursor-pointer"
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
                                                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/30'
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
                                                    <CheckCircle2 className="absolute top-2 right-2 text-blue-400" size={20} />
                                                )}
                                            </label>
                                        ))}
                                    </div>
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
                                                    ? 'border-blue-500 bg-blue-500/10'
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
                                                    <CheckCircle2 className="absolute top-2 right-2 text-blue-400" size={16} />
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
                                        <div className="w-5 h-5 border-2 border-white/20 rounded bg-white/5 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-300 flex items-center justify-center">
                                            {formData.terms && <CheckCircle2 className="text-white" size={14} />}
                                        </div>
                                    </div>
                                    <span className="text-sm text-slate-300 leading-relaxed">
                                        I agree to the <span className="text-blue-400 font-semibold">Terms</span> and <span className="text-blue-400 font-semibold">Privacy Policy</span>
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                    <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center gap-3 font-bold text-white text-lg shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-blue-500/50">
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
                                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-blue-400/50 hover:decoration-blue-300">
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