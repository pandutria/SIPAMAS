/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";

interface FormSelectProps {
    title: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<any>) => void;
    children: any;
    name?: string;
    disabled?: boolean;
    required?: boolean;
}

export default function FormSelect({ title, value, onChange, children, name, disabled=false, required=true }: FormSelectProps) {
    return (
        <div>
            <label className="block font-poppins-medium text-sm text-gray-700 mb-2">{title} <span className="text-primary">{required ? "*" : ""}</span></label>
            <select disabled={disabled} name={name} value={value} onChange={onChange} className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-[14px] ${disabled ? "bg-gray-100 text-gray-400" : "bg-white"}`}>
                <option value="" disabled selected>Pilih {title}</option>
                {children}
            </select>
        </div>
    )
}
