import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createPageUrl } from "@/utils";
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', check: (p) => p.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', check: (p) => /[A-Z]/.test(p) },
    { id: 'lowercase', label: 'One lowercase letter', check: (p) => /[a-z]/.test(p) },
    { id: 'number', label: 'One number', check: (p) => /\d/.test(p) },
];

export default function Register() {
    const navigate = useNavigate();
    const { register: authRegister } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        acceptTerms: false
    });

    const isPasswordValid = passwordRequirements.every(req => req.check(formData.password));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Password does not meet requirements');
            return;
        }

        if (!formData.acceptTerms) {
            toast.error('Please accept terms and conditions');
            return;
        }

        try {
            setIsLoading(true);
            console.log('📝 Attempting registration with:', formData.email);

            // Use AuthContext's register function
            const user = await authRegister(formData.email, formData.password, formData.name);
            console.log('✅ Registration successful:', user);

            toast.success('Account created successfully!');
            navigate(createPageUrl('Home'));
        } catch (error) {
            console.error('❌ Registration error:', error);
            toast.error(error.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex pt-20">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-700" />
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
                    alt="Shopping"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-white/70 max-w-md">
                            Create an account to unlock exclusive deals, track your orders, and enjoy a personalized shopping experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <Link to={createPageUrl('Home')} className="text-3xl font-bold tracking-tight text-neutral-900">
                            LUXE
                        </Link>
                        <h1 className="text-2xl font-bold text-neutral-900 mt-8">Create account</h1>
                        <p className="text-neutral-500 mt-2">Start your shopping journey today</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    {passwordRequirements.map((req) => (
                                        <div key={req.id} className="flex items-center gap-2">
                                            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${req.check(formData.password) ? 'bg-green-500' : 'bg-neutral-200'
                                                }`}>
                                                {req.check(formData.password) && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <span className={`text-xs ${req.check(formData.password) ? 'text-green-600' : 'text-neutral-500'
                                                }`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.acceptTerms}
                                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked })}
                                    className="mt-1"
                                />
                                <Label htmlFor="terms" className="text-sm text-neutral-600 cursor-pointer leading-snug">
                                    I agree to the{' '}
                                    <a href="#" className="text-neutral-900 hover:underline">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-neutral-900 hover:underline">Privacy Policy</a>
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 rounded-full"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <Separator />
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-neutral-500">
                                    or continue with
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <Button variant="outline" className="rounded-full">
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" className="rounded-full">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    GitHub
                                </Button>
                            </div>
                        </div>

                        <p className="text-center text-sm text-neutral-500 mt-6">
                            Already have an account?{' '}
                            <Link to={createPageUrl('Login')} className="text-neutral-900 font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}