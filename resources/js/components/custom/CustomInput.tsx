import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CustomInputProps {
    label?: string
    placeholder?: string
    type?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
    disabled?: boolean
    required?: boolean
    className?: string
    icon?: React.ReactNode
}

function CustomInput({ 
    label, 
    placeholder, 
    type = 'text', 
    value, 
    onChange, 
    error,
    disabled = false,
    required = false,
    className = '',
    icon
}: CustomInputProps) {
    const { t, i18n } = useTranslation()
    const [isFocused, setIsFocused] = useState(false)
    const isRTL = i18n.language === 'ar'
    
    const hasError = !!error
    
    return (
        <div className={`relative ${className}`}>
            {/* Label */}
            {label && (
                <label 
                    className={`
                        block mb-2 text-sm font-semibold transition-colors duration-200
                        ${hasError 
                            ? 'text-red-600' 
                            : isFocused 
                                ? 'text-orange-600' 
                                : 'text-gray-700 dark:text-gray-300'
                        }
                        ${isRTL ? 'text-right arabic-font' : 'text-left'}
                    `}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div className={`
                        absolute top-1/2 transform -translate-y-1/2 z-10
                        ${isRTL ? 'right-4' : 'left-4'}
                        ${hasError ? 'text-red-500' : isFocused ? 'text-orange-600' : 'text-gray-400'}
                        transition-colors duration-200
                    `}>
                        {icon}
                    </div>
                )}
                
                {/* Input Field */}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full h-12 px-4 py-3 text-sm font-medium
                        bg-white dark:bg-gray-800
                        border-2 rounded-xl
                        transition-all duration-300 ease-in-out
                        placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal
                        ${icon ? (isRTL ? 'pr-12' : 'pl-12') : ''}
                        ${isRTL ? 'text-right rtl' : 'text-left ltr'}
                        ${hasError
                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-800/30 shadow-lg shadow-red-100 dark:shadow-red-900/20'
                            : disabled
                                ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700'
                                : isFocused
                                    ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-800/30 shadow-lg shadow-orange-100 dark:shadow-orange-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-orange-600 hover:shadow-md hover:shadow-orange-100 dark:hover:shadow-orange-900/20'
                        }
                        focus:outline-none
                        dark:text-white
                        transform hover:scale-[1.02] focus:scale-[1.02]
                    `}
                />
                
                {/* Professional Focus Ring */}
                {isFocused && !hasError && !disabled && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 pointer-events-none animate-pulse" />
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <div className={`mt-2 flex items-center gap-2 ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}>
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
            )}
        </div>
    )
}

export default CustomInput