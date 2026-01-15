'use client';

import { useState } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

// Types
interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: 'student' | 'teacher';
    };
    message?: string;
}

interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
    const [touched, setTouched] = useState({ email: false, password: false });

    // Axios-style API call using fetch
    const apiLogin = async (url: string, data: any): Promise<LoginResponse> => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: 'Login failed. Please try again.',
            }));
            throw errorData;
        }

        return response.json();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setError('');
    };

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLDivElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setTouched({ email: true, password: true });

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // Replace with your actual API endpoint
            const API_URL = 'https://your-api-url.com/api/auth/login';

            const response = await apiLogin(API_URL, {
                email: formData.email,
                password: formData.password,
                role: userRole,
            });

            if (response.success && response.token) {
                console.log('Login successful:', response);
                alert(`Login successful! Redirecting to ${userRole} dashboard...`);
            }
        } catch (err: any) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getFieldError = (field: 'email' | 'password') => {
        if (!touched[field]) return '';
        if (field === 'email' && formData.email && !validateEmail(formData.email)) {
            return 'Invalid email format';
        }
        if (field === 'password' && formData.password && formData.password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const isFormValid = formData.email && formData.password && validateEmail(formData.email) && formData.password.length >= 6;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md lg:max-w-lg">
                {/* Logo and Header */}
                <div className="text-center mb-6 sm:mb-8 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                        <div className="relative">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EduConnect
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-gray-600">Sign in to continue your learning journey</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6 backdrop-blur-sm bg-opacity-95">
                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setUserRole('student')}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base ${userRole === 'student'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className="hidden sm:inline">Student</span>
                            <span className="sm:hidden">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserRole('teacher')}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base ${userRole === 'teacher'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className="hidden sm:inline">Teacher</span>
                            <span className="sm:hidden">Teacher</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-shake">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${getFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="student@example.com"
                                />
                                {formData.email && !getFieldError('email') && touched.email && (
                                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                )}
                            </div>
                            {getFieldError('email') && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{getFieldError('email')}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('password')}
                                    className={`w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base ${getFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {getFieldError('password') && (
                                <p className="mt-1 text-xs sm:text-sm text-red-600">{getFieldError('password')}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-xs sm:text-sm text-gray-700">Remember me</span>
                            </label>
                            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base transform hover:scale-105 active:scale-95 ${userRole === 'teacher'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-200'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200'
                                } ${isLoading || !isFormValid ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-3 sm:px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-gray-700 font-medium text-xs sm:text-sm hidden xs:inline">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="text-gray-700 font-medium text-xs sm:text-sm hidden xs:inline">Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mb-4">
                    <p className="text-sm sm:text-base text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:text-blue-700 font-medium transition">
                            Sign up for free
                        </a>
                    </p>
                </div>

                {/* Demo Info */}
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                    <p className="text-xs sm:text-sm text-blue-800 text-center">
                        <strong>Demo:</strong> Enter any email and password (6+ chars) to see the login flow
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }

                .animate-shake {
                    animation: shake 0.3s ease-out;
                }

                @media (max-width: 640px) {
                    .xs\:inline {
                        display: inline;
                    }
                }
            `}</style>
        </div>
    );
}