import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';
import CustomInput from '@/components/custom/CustomInput';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { t, i18n } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isRTL = i18n.language === 'ar';
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Head title="Register" />
            
            {/* Creative Car Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`
                }}
            />
            
            {/* Secondary Background Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 animate-pulse"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                }}
            />
            
            {/* Glassy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-800/30 to-orange-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            
            {/* Animated Geometric Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl animate-ping" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-bounce" />
            </div>
            
            {/* Floating Car Elements */}
            <div className="absolute inset-0">
                {[...Array(18)].map((_, i) => (
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
                <div className="w-full max-w-lg">
                    {/* Glass Morphism Register Card */}
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl border border-white/30">
                                <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl">
                                {t('create-account')}
                            </h1>
                            <p className="text-white/90 text-base drop-shadow-lg">
                                Join our premium automotive community
                            </p>
                        </div>

                        {/* Register Form */}
                        <form className="space-y-6" onSubmit={submit}>
                            {/* Name Field */}
                            <div className="space-y-1">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <CustomInput
                                            label={t('name')}
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            required
                                            disabled={processing}
                                            icon={<User className="w-5 h-5" />}
                                        />
                                    </div>
                                </div>
                            </div>

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
                                            disabled={processing}
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
                                            placeholder="Create a strong password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            error={errors.password}
                                            required
                                            disabled={processing}
                                            icon={<Lock className="w-5 h-5" />}
                                        />
                                        {/* Password Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`
                                                absolute top-11 transform -translate-y-1/2 z-30
                                                ${isRTL ? 'left-4' : 'right-4'}
                                                text-white/70 hover:text-blue-300 transition-all duration-300
                                                focus:outline-none focus:text-blue-300 p-2 rounded-xl
                                                hover:bg-white/20 backdrop-blur-sm border border-white/10
                                            `}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            {/* <div className="space-y-1">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300" />
                                    <div className="relative z-10">
                                        <CustomInput
                                            label={t('confirm-password')}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            error={errors.password_confirmation}
                                            required
                                            disabled={processing}
                                            icon={<Lock className="w-5 h-5" />}
                                        />
                                        
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`
                                                absolute top-11 transform -translate-y-1/2 z-30
                                                ${isRTL ? 'left-4' : 'right-4'}
                                                text-white/70 hover:text-blue-300 transition-all duration-300
                                                focus:outline-none focus:text-blue-300 p-2 rounded-xl
                                                hover:bg-white/20 backdrop-blur-sm border border-white/10
                                            `}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div> */}

                            {/* Register Button */}
                            <Button 
                                type="submit" 
                                className="w-full h-14 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm border border-white/30" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-6 w-6 animate-spin mr-3" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-6 w-6 mr-3" />
                                        {t('create-account')}
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-8 pt-6 border-t border-white/20">
                            <p className="text-center text-sm text-white/90 drop-shadow-sm">
                                {t('have-account')}{' '}
                                <TextLink 
                                    href={route('login')} 
                                    className="font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200 drop-shadow-sm"
                                >
                                    {t('login')}
                                </TextLink>
                            </p>
                        </div>

                        {/* Terms Notice */}
                        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20">
                            <p className="text-xs text-white/80 text-center drop-shadow-sm">
                                🔐 By creating an account, you agree to our terms and privacy policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
