'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired, getPasswordStrengthColor, getPasswordStrengthWidth } from '@/lib/validation';
import { Eye, EyeOff, Sparkles, User, Mail, Lock, Briefcase, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

    const interestOptions = [
        'Business',
        'Education',
        'Technology',
        'Marketing',
        'Design',
        'Science',
    ];

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

        // Clear error for this field
        setErrors(prev => ({ ...prev, [name]: '' }));

        // Update password strength
        if (name === 'password') {
            const validation = validatePassword(value);
            setPasswordStrength(validation.strength);
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.fullName)) {
            newErrors.fullName = 'Full name is required';
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errors[0];
        }

        if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const { error } = await signUp(formData.email, formData.password, {
            full_name: formData.fullName,
            role: formData.role,
            account_type: formData.accountType,
            interests: formData.interests,
            newsletter: formData.newsletter,
        });

        setLoading(false);

        if (error) {
            setErrors({ submit: error.message });
        } else {
            router.push('/explore');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 hover-glow">
                            <Sparkles className="text-white" size={32} />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text-blue mb-2">
                            Create Account
                        </h1>
                        <p className="text-indigo-200/80">
                            Join PowerMyPoint and start creating amazing presentations
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <User className="inline mr-2" size={16} />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 transition-all"
                            />
                            {errors.fullName && <p className="text-red-300 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <Mail className="inline mr-2" size={16} />
                                Email Address *
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
                                Password *
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
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 h-1">
                                        <div className={`flex-1 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)} ${getPasswordStrengthWidth(passwordStrength)}`} />
                                    </div>
                                    <p className="text-xs text-indigo-200/70 mt-1 capitalize">{passwordStrength} password</p>
                                </div>
                            )}
                            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <Lock className="inline mr-2" size={16} />
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white placeholder-indigo-200/50 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Role Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                <Briefcase className="inline mr-2" size={16} />
                                Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/5 text-white transition-all"
                            >
                                <option value="" className="bg-slate-900">Select your role</option>
                                <option value="student" className="bg-slate-900">Student</option>
                                <option value="teacher" className="bg-slate-900">Teacher</option>
                                <option value="professional" className="bg-slate-900">Professional</option>
                                <option value="business" className="bg-slate-900">Business Owner</option>
                            </select>
                            {errors.role && <p className="text-red-300 text-sm mt-1">{errors.role}</p>}
                        </div>

                        {/* Account Type Radio Buttons */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                                Account Type
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="accountType"
                                        value="personal"
                                        checked={formData.accountType === 'personal'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-white">Personal</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="accountType"
                                        value="business"
                                        checked={formData.accountType === 'business'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-white">Business</span>
                                </label>
                            </div>
                        </div>

                        {/* Interests Checkboxes */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                                <Heart className="inline mr-2" size={16} />
                                Interests (Select all that apply)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {interestOptions.map((interest) => (
                                    <label key={interest} className="flex items-center gap-2 cursor-pointer glass-dark px-3 py-2 rounded-lg hover:glass transition-all">
                                        <input
                                            type="checkbox"
                                            name="interests"
                                            value={interest}
                                            checked={formData.interests.includes(interest)}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-white text-sm">{interest}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Checkbox */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer glass-dark px-4 py-3 rounded-lg hover:glass transition-all">
                                <input
                                    type="checkbox"
                                    name="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleChange}
                                    className="w-4 h-4 mt-1 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-white text-sm">
                                    Subscribe to our newsletter for tips, updates, and exclusive content
                                </span>
                            </label>
                        </div>

                        {/* Terms Checkbox */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className="w-4 h-4 mt-1 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-white text-sm">
                                    I agree to the <Link href="/terms" className="text-indigo-300 hover:text-indigo-200 underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200 underline">Privacy Policy</Link> *
                                </span>
                            </label>
                            {errors.terms && <p className="text-red-300 text-sm mt-1">{errors.terms}</p>}
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
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-indigo-200/80">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-300 hover:text-white font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
