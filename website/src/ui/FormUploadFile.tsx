import { Upload, FileText } from "lucide-react";
import React from "react";
import { BASE_URL_FILE } from "../server/API";

const ALLOWED_FILE_TYPES = [
    { ext: '.pdf', label: 'PDF' },
    { ext: '.xlsx', label: 'XLSX' },
    { ext: '.jpg', label: 'JPG' },
    { ext: '.jpeg', label: 'JPEG' },
    { ext: '.png', label: 'PNG' },
    { ext: '.webp', label: 'WEBP' },
];

interface FormUploadFileProps {
    title: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: File | string | null;
    name?: string;
    disabled?: boolean;
    type?: 'edit' | 'show';
    required?: boolean;
}

export default function FormUploadFile({
    title,
    onChange,
    value,
    name,
    disabled = false,
    type = 'edit',
    required=true
}: FormUploadFileProps) {
    const [fileName, setFileName] = React.useState<string | null>(
        typeof value === 'string' ? value.split("/").pop() || null : value instanceof File ? value.name : null
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
        onChange?.(e);
    };

    const handleClickFile = () => {
        if (value && typeof value === 'string') {
            window.open(`${BASE_URL_FILE}/${value}`, "_blank");
        }
    };

    return (
        <div>
            <label className="block font-poppins-medium text-sm text-gray-700 mb-2">
                {title} <span className="text-primary">{required ? "*" : ""}</span>
            </label>

            {type === 'show' && typeof value === 'string' ? (
                <div>
                    <a
                        href={`${BASE_URL_FILE}/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center cursor-pointer justify-between w-full px-4 py-2.5 border border-gray-300 rounded-lg font-poppins text-primary hover:bg-primary/5 transition-all duration-200"
                    >
                        <span className="text-sm truncate">Lihat File</span>
                        <FileText className="h-5 w-5 text-primary" />
                    </a>
                    {fileName && (
                        <p className="mt-1 text-sm text-gray-600 truncate">Terpilih: {fileName}</p>
                    )}
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    {value && typeof value === 'string' && (
                        <div>
                            <button
                                type="button"
                                onClick={handleClickFile}
                                className="flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-lg font-poppins text-primary hover:bg-primary/5 transition-all duration-200"
                            >
                                <span className="text-sm truncate">Lihat File</span>
                                <FileText className="h-5 w-5 ml-2" />
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type="file"
                            id={name}
                            name={name}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleChange}
                            disabled={disabled}
                        />
                        <label
                            htmlFor={name}
                            className={`flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg font-poppins transition-all duration-200
                            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:border-primary hover:bg-primary/5 cursor-pointer'}`}
                        >
                            <span className="text-sm">{fileName ? fileName.slice(0, 26) + "..." : "Upload"}</span>
                            <Upload className="h-5 w-5 text-primary" />
                        </label>
                    </div>
                </div>
            )}
            <p className="text-sm font-poppins-medium mt-2 text-[12px] text-gray-500">
                {fileName ? fileName.slice(0, 26) + "..." : "Upload"}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
                Format: {ALLOWED_FILE_TYPES.map(ft => ft.label).join(', ')}
            </p>
        </div>
    );
}