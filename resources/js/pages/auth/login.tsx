import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';
import CustomInput from '@/components/custom/CustomInput';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t, i18n } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const isRTL = i18n.language === 'ar';

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Head title={t('login')} />
            
            {/* Creative Car Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                }}
            />
            
            {/* Secondary Background Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 animate-pulse"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`
                }}
            />
            
            {/* Glassy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 via-purple-800/30 to-blue-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            
            {/* Animated Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-bounce" />
            </div>
            
            {/* Floating Car Elements */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    {/* Glass Morphism Login Card */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] border-gradient">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/80 to-orange-600/80 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl border border-white/30">
                                <Lock className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl">
                                {t('login')}
                            </h1>
                            <p className="text-white/90 text-base drop-shadow-lg">
                                Welcome to your premium dashboard
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm">
                                <p className="text-green-100 text-sm font-medium text-center drop-shadow-sm">{status}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={submit}>
                            {/* Email Field */}
                            <div className="space-y-1">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <CustomInput
                                            label={t('email')}
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={errors.email}
                                            required
                                            icon={<Mail className="w-5 h-5" />}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <CustomInput
                                            label={t('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            error={errors.password}
                                            required
                                            icon={<Lock className="w-5 h-5" />}
                                        />
                                        {/* Password Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`
                                                absolute top-11 transform -translate-y-1/2 z-30
                                                ${isRTL ? 'left-4' : 'right-4'}
                                                text-white/70 hover:text-orange-300 transition-all duration-300
                                                focus:outline-none focus:text-orange-300 p-2 rounded-xl
                                                hover:bg-white/20 backdrop-blur-sm border border-white/10
                                            `}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-1 border border-white/20">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onClick={() => setData('remember', !data.remember)}
                                            className="border-white/40 text-orange-400 focus:ring-orange-400 bg-white/20"
                                        />
                                    </div>
                                    <Label htmlFor="remember" className="text-sm text-white/90 cursor-pointer drop-shadow-sm font-medium">
                                        {t('remember-me')}
                                    </Label>
                                </div>
                                
                                {canResetPassword && (
                                    <TextLink 
                                        href={route('password.request')} 
                                        className="text-sm text-orange-300 hover:text-orange-200 font-semibold transition-colors duration-200 drop-shadow-sm backdrop-blur-sm hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10"
                                    >
                                        {t('forget-password')}
                                    </TextLink>
                                )}
                            </div>

                            {/* Login Button */}
                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-gradient-to-r from-orange-500/90 to-orange-600/90 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm border border-white/30" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-6 w-6 animate-spin mr-3" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-6 w-6 mr-3" />
                                        {t('login')}
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <p className="text-center text-sm text-white/90 drop-shadow-sm">
                                {t('no-account')}{' '}
                                <TextLink 
                                    href={route('register')} 
                                    className="font-bold text-orange-300 hover:text-orange-200 transition-colors duration-200 drop-shadow-sm"
                                >
                                    {t('sign-up')}
                                </TextLink>
                            </p>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                            <p className="text-xs text-white/80 text-center drop-shadow-sm">
                                🔒 Your data is secured with enterprise-grade encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
