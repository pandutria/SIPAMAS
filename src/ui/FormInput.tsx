/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";

interface formInputProps {
    title: string;
    placeholder: string;
    disabled?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<any>) => void;
    type?: 'input' | 'textarea' | 'date' | 'number' | 'email' | 'password' | 'tel';
    name?: string;
    required?: boolean;
}

export default function FormInput({ value, onChange, title, placeholder, disabled = false, type = 'input', name, required=true }: formInputProps) {
    return (
        <div className={`${type == 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="block font-poppins-medium text-sm text-gray-700 mb-2">{title} <span className="text-primary">{required ? "*" : ""}</span></label>
            {type == 'input' ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} text-[14px] px-4 py-2.5 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ) : type == 'textarea' ? (
                <textarea
                    value={value}
                    disabled={disabled}
                    name={name}
                    rows={3}
                    className={`w-full ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} text-[14px] px-4 py-2.5 border border-gray-300 rounded-lg font-poppins resize-none`}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : type == "date" ? (
                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    className={`w-full ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} text-[14px] px-4 py-2.5 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''} text-[14px] px-4 py-2.5 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            )}
        </div>
    )
}
